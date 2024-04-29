const httpStatus = require('http-status');

const { Cart } = require('../models');
const ApiError = require('../utils/ApiError');
const { cartMessage } = require('../messages');

const getCartById = async (cartId) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, cartMessage().NOT_FOUND);
  }

  return cart;
};

const createCart = async (cartBody) => {
  const cart = await Cart.create(cartBody);
  return cart;
};

const getCartsByKeyword = async (query) => {
  const results = await Cart.find(query);
  return { Carts: results };
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
  createCart,
  getCartById,
  updateCartById,
  deleteCartById,
  getCartsByKeyword,
};
