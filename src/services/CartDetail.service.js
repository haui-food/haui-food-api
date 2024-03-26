const { CartDetail } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { cartDetailMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const getCartDetailById = async (id) => {
  const cartDetail = await CartDetail.findById(id);
  if (!cartDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, cartDetailMessage().NOT_FOUND);
  }
  return cartDetail;
};

const createCartDetail = async (cartDetailBody) => {
  const cartDetail = await CartDetail.create(cartDetailBody);
  return cartDetail;
};

const getCartDetailsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(CartDetail);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['productId', 'quantity']);
  return { CartDetails: results, ...detailResult };
};

const updateCartDetailById = async (cartDetailId, updateBody) => {
  const cartDetail = await getCartDetailById(cartDetailId);
  Object.assign(cartDetail, updateBody);
  await cartDetail.save();
  return cartDetail;
};

const deleteCartDetailById = async (cartDetailId) => {
  const cartDetail = await getCartDetailById(cartDetailId);
  await cartDetail.deleteOne();
  return cartDetail;
};

module.exports = {
  getCartDetailById,
  createCartDetail,
  getCartDetailsByKeyword,
  updateCartDetailById,
  deleteCartDetailById,
};
