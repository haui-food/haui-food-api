const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');
const { orderMessage } = require('../messages');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, orderMessage().CREATE_SUCCESS, order));
});

const getOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getOrdersByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().FIND_LIST_SUCCESS, orders));
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().FIND_SUCCESS, order));
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().UPDATE_SUCCESS, order));
});

const deleteOrder = catchAsync(async (req, res) => {
  const order = await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, orderMessage().DELETE_SUCCESS, order));
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
