const httpStatus = require('http-status');

const response = require('../utils/response');
const { orderService } = require('../services');
const { orderMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const { REQUEST_USER_KEY } = require('../constants');

const createOrder = catchAsync(async (req, res) => {
  const user = req[REQUEST_USER_KEY];

  const orders = await orderService.createOrder(user, req.body);

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, orderMessage().CREATE_SUCCESS, orders));
});

const getOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getOrdersByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().FIND_LIST_SUCCESS, orders));
});

const getOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.getOrderById(orderId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().FIND_SUCCESS, order));
});

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.updateOrderById(orderId, req.body);

  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().UPDATE_SUCCESS, order));
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.deleteOrderById(orderId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().DELETE_SUCCESS, order));
});

const exportExcel = catchAsync(async (req, res) => {
  const wb = await orderService.exportExcel(req.query);
  wb.writeToBuffer().then((buffer) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `products-hauifood.com-${Date.now()}.xlsx`);
    res.send(buffer);
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const user = req[REQUEST_USER_KEY];

  const orders = await orderService.getMyOrders(user, req.query);

  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().FIND_LIST_SUCCESS, orders));
});

module.exports = {
  getOrders,
  getMyOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  exportExcel,
  getOrderById,
};
