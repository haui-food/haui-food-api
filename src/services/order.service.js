const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { orderMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');
const { userService } = require('./user.service');
const { Order, Cart, CartDetail } = require('../models');
const findCommonElements = require('../utils/findCommonElements');
const {
  STYLE_EXPORT_EXCEL,
  MAX_ORDER_PER_USER,
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  LIMIT_DEFAULT_EXPORT,
} = require('../constants');

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, orderMessage().NOT_FOUND);
  }

  return order;
};

const createOrder = async (user, orderBody) => {
  const { cartDetails, paymentMethod, address, note } = orderBody;

  const myOrderNumbers = await Order.countDocuments({ user: user._id, status: 'pending' });

  if (myOrderNumbers >= MAX_ORDER_PER_USER) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Số đơn chờ duyệt đã quá giới hạn. Vui lòng đợi duyệt hoặc huỷ đơn cũ.');
  }

  const cartDetailIdsUnique = [...new Set(cartDetails)];

  const cart = await Cart.findOne({
    user: user._id,
  }).populate([
    {
      path: 'cartDetails',
      populate: { path: 'product' },
    },
  ]);

  const listCartDetails = cart.cartDetails.map((cartDetail) => cartDetail._id.toString());

  const listCartDetailsOrder = findCommonElements(cartDetailIdsUnique, listCartDetails);

  if (listCartDetailsOrder.length !== cartDetailIdsUnique.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể đặt đơn vui lòng kiểm tra lại cartDetails');
  }

  const cartDetailsZ = await CartDetail.find({ _id: { $in: listCartDetailsOrder } }).populate([
    {
      path: 'product',
      populate: { path: 'shop' },
    },
  ]);

  const shopUnique = [...new Set(cartDetailsZ.map((cartDetail) => cartDetail.product.shop))];

  const orders = [];

  for (const shop of shopUnique) {
    const cartDetails = cartDetailsZ
      .filter((cartDetail) => cartDetail.product.shop._id.toString() === shop._id.toString())
      .map((cartDetail) => ({
        cartDetail: cartDetail._id.toString(),
      }));

    orders.push({
      shop: shop._id.toString(),
      cartDetails,
      totalMoney: cartDetailsZ
        .filter((cartDetail) => cartDetail.product.shop._id.toString() === shop._id.toString())
        .reduce((total, cartDetail) => total + cartDetail.totalPrice, 0),
    });
  }

  const newOrders = [];

  const totalMoneyOrder = orders.reduce((total, order) => total + order.totalMoney, 0);

  if (paymentMethod === 'prepaid') {
    if (totalMoneyOrder > user.accountBalance) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Số dư của bạn không đủ');
    }
  }

  for (const order of orders) {
    const newOrder = await Order.create({
      user: user._id,
      shop: order.shop,
      note: note || '',
      address: address || '',
      totalMoney: order.totalMoney,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'prepaid' ? 'paid' : 'unpaid',
      cartDetails: order.cartDetails.map((cartDetail) => cartDetail.cartDetail),
    });

    newOrders.push(newOrder);
  }

  const cartAgain = await Cart.findOne({
    user: user._id,
  });

  cartAgain.cartDetails = cartAgain.cartDetails.filter((cartDetail) => {
    return !cartDetailIdsUnique.includes(cartDetail._id.toString());
  });

  if (paymentMethod === 'prepaid') {
    user.accountBalance -= totalMoneyOrder;
    await user.save();
  }

  await cartAgain.save();

  return { orders: newOrders };
};

const getMyOrders = async (user, queryRequest) => {
  const query = { user: user._id };

  const { status = '', limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = queryRequest;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate([
      {
        path: 'shop',
        select: 'fullname avatar slug',
      },
      {
        path: 'cartDetails',
        select: 'product quantity totalPrice',
        populate: {
          path: 'product',
          select: 'name price image slug description',
        },
      },
    ])
    .select('-__v -user')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalSearch = await Order.countDocuments(query);

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: orders.length,
  };

  return { orders, ...detailResult };
};

const cancelOrderByIdUser = async (orderId, user) => {
  const order = await getOrderById(orderId);

  const isMyOrder = order.user.toString() === user._id.toString();

  if (!isMyOrder) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền cập nhật đơn hàng');
  }

  if (order.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể huỷ đơn hàng');
  }

  if (order.paymentMethod === 'prepaid') {
    user.accountBalance += order.totalMoney;
    await user.save();
  }

  order.status = 'canceled';
  await order.save();
};

const cancelOrderByIdShop = async (orderId, user) => {
  const order = await getOrderById(orderId);

  const isMyOrderForShop = order.shop.toString() === user._id.toString();

  if (!isMyOrderForShop) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền cập nhật đơn hàng');
  }

  if (['shipping', 'success', 'canceled'].includes(order.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể huỷ đơn hàng');
  }

  if (order.paymentMethod === 'prepaid') {
    const owner = await userService.getUserById(order.user);

    owner.accountBalance += order.totalMoney;
    await owner.save();
  }

  order.status = 'canceled';
  await order.save();
};

const updateOrderStatusById = async (orderId, user, status) => {
  const order = await getOrderById(orderId);

  const isMyOrderForShop = order.shop.toString() === user._id.toString();

  if (!isMyOrderForShop) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền thao tác đơn hàng này');
  }

  switch (status) {
    case 'reject':
      if (order.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể từ chối đơn');
      }
      break;
    case 'confirmed':
      if (order.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Bạn không thể duyệt đơn hàng');
      }
      break;
    case 'shipping':
      if (order.status !== 'confirmed') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể chuyển sang trạng thái giao đơn');
      }
      break;
    case 'success':
      if (order.status !== 'shipping') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể hoàn thành đơn hàng');
      }
      break;
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, 'Trạng thái đơn hàng không hợp lệ');
  }

  order.status = status;
  await order.save();

  return order;
};

const shopGetMyOrders = async (user, queryRequest) => {
  const query = { shop: user._id };

  const { status = '', limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = queryRequest;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate([
      {
        path: 'user',
        select: 'fullname avatar email phone',
      },
      {
        path: 'cartDetails',
        select: 'product quantity totalPrice',
        populate: {
          path: 'product',
          select: 'name price image slug description',
        },
      },
    ])
    .select('-__v -shop')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalSearch = await Order.countDocuments(query);

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: orders.length,
  };

  return { orders, ...detailResult };
};

const getOrdersByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Order);

  const { results, ...detailResult } = await apiFeature.getResults(query, [
    'user',
    'cart',
    'note',
    'address',
    'status',
  ]);

  return { orders: results, ...detailResult };
};

const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);

  Object.assign(order, updateBody);
  await order.save();

  return order;
};

const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);

  await order.deleteOne();

  return order;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Order);

  query.page = PAGE_DEFAULT;
  query.limit = LIMIT_DEFAULT_EXPORT;

  const { results } = await apiFeature.getResults(query, ['user', 'address', 'status']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Orders');

  const headerStyle = wb.createStyle(STYLE_EXPORT_EXCEL);

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(40);
  ws.column(6).setWidth(25);
  ws.column(7).setWidth(40);
  ws.column(8).setWidth(40);
  ws.column(9).setWidth(40);
  ws.column(10).setWidth(40);
  ws.column(11).setWidth(40);
  ws.column(12).setWidth(40);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('USER').style(headerStyle);
  ws.cell(1, 3).string('CART_DETAILS').style(headerStyle);
  ws.cell(1, 4).string('SHOP').style(headerStyle);
  ws.cell(1, 5).string('TOTAL_MONEY').style(headerStyle);
  ws.cell(1, 6).string('PAYMENT_METHOD').style(headerStyle);
  ws.cell(1, 7).string('PAYMENT_STATUS').style(headerStyle);
  ws.cell(1, 8).string('ADDRESS').style(headerStyle);
  ws.cell(1, 9).string('NOTE').style(headerStyle);
  ws.cell(1, 10).string('STATUS').style(headerStyle);
  ws.cell(1, 11).string('Last acctive').style(headerStyle);
  ws.cell(1, 12).string('Created At').style(headerStyle);

  results.forEach((order, index) => {
    ws.cell(index + 2, 1).string(order._id.toString());
    ws.cell(index + 2, 2).string(order.user.toString());
    ws.cell(index + 2, 3).string(order.cartDetails.toString());
    ws.cell(index + 2, 4).string(order.shop.toString());
    ws.cell(index + 2, 5).string(order.totalMoney.toString() + ' VND');
    ws.cell(index + 2, 6).string(order.paymentMethod);
    ws.cell(index + 2, 7).string(order.paymentStatus);
    ws.cell(index + 2, 8).string(order.address);
    ws.cell(index + 2, 9).string(order.note);
    ws.cell(index + 2, 10).string(order.status);
    ws.cell(index + 2, 11).string(moment(order.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 12).string(moment(order.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

module.exports = {
  getMyOrders,
  exportExcel,
  createOrder,
  getOrderById,
  updateOrderById,
  shopGetMyOrders,
  deleteOrderById,
  getOrdersByKeyword,
  cancelOrderByIdUser,
  cancelOrderByIdShop,
  updateOrderStatusById,
};
