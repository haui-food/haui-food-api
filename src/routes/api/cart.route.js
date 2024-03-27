const express = require('express');
const { cartController } = require('../../controllers');
const { cartValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');

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
