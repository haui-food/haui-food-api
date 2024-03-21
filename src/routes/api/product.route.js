const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { productController } = require('../../controllers');
const { productValidation } = require('../../validations');
const productRouter = express.Router();

productRouter
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(validate(productValidation.createProduct), productController.createProduct);

productRouter
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProductById)
  .put(validate(productValidation.updateProduct), productController.updateProduct)
  .delete(validate(productValidation.deleteProuduct), productController.deleteProduct);

productRouter
  .route('/users/:userId')
  .get(validate(productValidation.getProducts), productController.getProductsByuserId)
  .delete(validate(productValidation.deleteProuductByuserId), productController.deleteProductByuserId);

productRouter
  .route('/categories/:categoryId')
  .get(validate(productValidation.getProducts), productController.getProductsBycategoryId)
  .delete(validate(productValidation.deleteProuductBycategoryId), productController.deleteProductBycategoryId);

module.exports = productRouter;
