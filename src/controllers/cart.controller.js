const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');
const { cartMessage } = require('../messages');

const createCart = catchAsync(async (req, res) => {
  const cart = await cartService.createCart(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, cartMessage().CREATE_SUCCESS, cart));
});

const getCarts = catchAsync(async (req, res) => {
  const carts = await cartService.getCartsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().FIND_LIST_SUCCESS, carts));
});

const getCartById = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const cart = await cartService.getCartById(cartId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().FIND_SUCCESS, cart));
});

const updateCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const cart = await cartService.updateCartById(cartId, req.body);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().UPDATE_SUCCESS, cart));
});

const deleteCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const cart = await cartService.deleteCartById(cartId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartMessage().DELETE_SUCCESS, cart));
});

module.exports = {
  getCarts,
  updateCart,
  deleteCart,
  createCart,
  getCartById,
};
