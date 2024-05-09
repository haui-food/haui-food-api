const httpStatus = require('http-status');
const ObjectId = require('mongoose').Types.ObjectId;

const ApiError = require('../utils/ApiError');
const { cartMessage } = require('../messages');
const { Cart, CartDetail } = require('../models');
const productService = require('./product.service');
const selectProperties = require('../utils/selectProperties');

const getCartById = async (cartId) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, cartMessage().NOT_FOUND);
  }

  return cart;
};

const addProductToCartV1 = async (cartBody, user) => {
  const { product, quantity = 1 } = cartBody;

  await productService.getProductById(product);

  const cartExists = await Cart.findOne({ user }).populate([
    {
      path: 'cartDetails',
      populate: { path: 'product' },
    },
    {
      path: 'user',
    },
  ]);

  if (cartExists) {
    let cartDetailExists = false;

    for (cartDetail of cartExists.cartDetails) {
      if (cartDetail.product.id === product) {
        if (cartDetail.quantity + quantity > 100) {
          throw new ApiError(httpStatus.BAD_REQUEST, cartMessage().MAXIMUM_QUANTITY_BY_CATEGORY);
        }
        cartDetail.quantity += quantity;

        await cartDetail.save();

        cartDetailExists = true;

        break;
      }
    }

    if (!cartDetailExists) {
      const newCartDetail = await CartDetail.create({
        product,
        quantity,
      });

      await Cart.findOneAndUpdate(
        { user },
        {
          $push: { cartDetails: new ObjectId(newCartDetail._id) },
        },
        { new: true },
      );
    }
  } else {
    const newCartDetail = await CartDetail.create({
      product,
      quantity,
    });

    await Cart.create({
      user,
      cartDetails: new ObjectId(newCartDetail._id),
    });
  }

  const cartUpdated = await updateTotalMoney(user);

  return cartUpdated;
};

const addProductToCartV2 = async (cartBody, user) => {
  const { product, quantity = 1 } = cartBody;

  await productService.getProductById(product);

  const cart = await Cart.findOne({ user }).populate([
    {
      path: 'cartDetails',
      populate: { path: 'product' },
    },
    {
      path: 'user',
    },
  ]);

  let cartDetailExists = false;

  for (cartDetail of cart.cartDetails) {
    if (cartDetail.product.id === product) {
      if (cartDetail.quantity + quantity > 100) {
        throw new ApiError(httpStatus.BAD_REQUEST, cartMessage().MAXIMUM_QUANTITY_BY_CATEGORY);
      }
      cartDetail.quantity += quantity;

      await cartDetail.save();

      cartDetailExists = true;

      break;
    }
  }

  if (!cartDetailExists) {
    const newCartDetail = await CartDetail.create({
      product,
      quantity,
    });

    await Cart.findOneAndUpdate(
      { user },
      {
        $push: { cartDetails: new ObjectId(newCartDetail._id) },
      },
      { new: true },
    );
  }

  const cartUpdated = await updateTotalMoney(user);

  return cartUpdated;
};

const removeProductFromCart = async (cartBody, user) => {
  const { product, quantity = 1, isDeleteAll = false } = cartBody;

  if (quantity <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Số lượng sản phẩm xoá cần lớn hơn 0');
  }

  const cart = await Cart.findOne({ user }).populate([
    {
      path: 'cartDetails',
      select: 'product quantity',
      populate: { path: 'product' },
    },
  ]);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy giỏ hàng của bạn');
  }

  for (cartDetail of cart.cartDetails) {
    if (cartDetail.product.id === product) {
      if (cartDetail.quantity - quantity < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể xoá số lượng nhiều hơn số lượng đang có');
      }

      if (cartDetail.quantity - quantity === 0 || isDeleteAll) {
        await CartDetail.deleteOne({ _id: cartDetail._id });

        await Cart.findOneAndUpdate(
          { user },
          {
            $pull: { cartDetails: cartDetail._id },
          },
          { new: true },
        );

        break;
      }

      cartDetail.quantity -= quantity;

      await cartDetail.save();
    }
  }

  const cartUpdated = await updateTotalMoney(user);

  return cartUpdated;
};

const updateTotalMoney = async (user) => {
  const againCart = await Cart.findOne({ user })
    .populate([
      {
        path: 'cartDetails',
        select: 'product quantity',
        populate: { path: 'product', select: 'name price image slug description' },
      },
      {
        path: 'user',
        select: 'fullname email phone',
      },
    ])
    .select('-__v');

  let total = 0;

  for (cartDetail of againCart.cartDetails) {
    total += cartDetail.product.price * cartDetail.quantity;
  }

  againCart.totalMoney = total;

  await againCart.save();

  return againCart;
};

const getMyCartV1 = async (user) => {
  const query = { user: user.id };

  const cart = await Cart.findOne(query)
    .populate([
      {
        path: 'cartDetails',
        select: 'product quantity',
        populate: { path: 'product', select: 'name price image slug description' },
      },
    ])
    .select('-__v -user');

  return { user: selectProperties(user.toObject(), '_id fullname email phone avatar'), cart };
};

const getMyCartV2 = async (user) => {
  const cart = await Cart.findOne({ user: user.id }).populate([
    {
      path: 'user',
      select: 'fullname email phone',
    },
    {
      path: 'cartDetails',
      select: 'product quantity',
      populate: {
        path: 'product',
        select: 'name price shop image description',
        populate: {
          path: 'shop',
          select: '_id fullname email phone address avatar slug',
        },
      },
    },
  ]);

  const { cartDetails } = cart;

  const cartDetailIds = cartDetails.map((cartDetail) => cartDetail._id);

  console.log(cartDetailIds);

  const shopUnique = [...new Set(cartDetails.map((cartDetail) => cartDetail.product.shop))];

  const carts = [];

  for (const shop of shopUnique) {
    const cart = cartDetails
      .filter((cartDetail) => cartDetail.product.shop._id.toString() === shop._id.toString())
      .map((cartDetail) => {
        return {
          _id: cartDetail._id,
          product: { ...cartDetail.product.toObject(), shop: undefined },
          quantity: cartDetail.quantity,
          totalPrice: cartDetail.product.price * cartDetail.quantity,
        };
      });
    carts.push({ shop, cartDetails: cart, totalMoney: cart.reduce((a, b) => a + b.totalPrice, 0) });
  }

  const totalMoney = carts.reduce((a, b) => a + b.totalMoney, 0);

  return { carts, totalMoney };
};

const getCartsByKeyword = async (query) => {
  const results = await Cart.find(query);
  return { carts: results };
};

const updateCartById = async (cartId, updateBody) => {
  const cart = await getCartById(cartId);

  Object.assign(cart, updateBody);
  await cart.save();

  return cart;
};

const deleteCartById = async (cartId) => {
  const cart = await getCartById(cartId);

  await cart.deleteOne();

  return cart;
};

module.exports = {
  getMyCartV1,
  getMyCartV2,
  getCartById,
  updateCartById,
  deleteCartById,
  getCartsByKeyword,
  addProductToCartV1,
  addProductToCartV2,
  removeProductFromCart,
};
