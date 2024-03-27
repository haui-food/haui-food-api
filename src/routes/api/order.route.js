const express = require('express');
const { orderController } = require('../../controllers');
const { orderValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const orderRouter = express.Router();

orderRouter
  .route('/')
  .get(validate(orderValidation.getOrders), orderController.getOrders)
  .post(auth, authorize('admin'), validate(orderValidation.createOrder), orderController.createOrder);

orderRouter
  .route('/:orderId')
  .get(auth, authorize('admin'), validate(orderValidation.getOrder), orderController.getOrderById)
  .put(auth, authorize('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth, authorize('admin'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = orderRouter;
