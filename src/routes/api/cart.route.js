const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { cartController } = require('../../controllers');
const { cartValidation } = require('../../validations');
// const { auth, authorize } = require('../../middlewares/auth.middleware');
// auth, authorize('admin'),
// auth, authorize('admin'),
// auth, authorize('admin'),
const cartRouter = express.Router();

cartRouter
  .route('/')
  .get(validate(cartValidation.getCarts), cartController.getCarts)
  .post(validate(cartValidation.createCart), cartController.createCart);

cartRouter
  .route('/:cartId')
  .get(validate(cartValidation.getCart), cartController.getCartById)
  .put(validate(cartValidation.updateCart), cartController.updateCart)
  .delete(validate(cartValidation.deleteCart), cartController.deleteCart);

module.exports = cartRouter;
