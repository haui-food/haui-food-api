const httpStatus = require('http-status');

const { Order } = require('../models');
const ApiError = require('../utils/ApiError');
const { orderMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const getOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, orderMessage().NOT_FOUND);
  }
  return order;
};

const createOrder = async (orderBody) => {
  const order = await Order.create(orderBody);
  return order;
};

const getOrdersByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Order);
  const { results, ...detailResult } = await apiFeature.getResults(query, [
    'userId',
    'cartId',
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

module.exports = {
  getOrderById,
  createOrder,
  getOrdersByKeyword,
  updateOrderById,
  deleteOrderById,
};
