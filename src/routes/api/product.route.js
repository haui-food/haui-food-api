const express = require('express');
const { productController } = require('../../controllers');
const { productValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(auth, authorize('admin', 'shop'), validate(productValidation.createProduct), productController.createProduct);

productRouter
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProductById)
  .put(auth, authorize('admin', 'shop'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(
    auth,
    authorize('admin', 'shop'),
    validate(productValidation.deleteProuduct),
    productController.deleteProduct,
  );

productRouter
  .route('/users/:userId')
  .get(validate(productValidation.getProducts), productController.getProductsByuserId)
  .delete(
    auth,
    authorize('admin', 'shop'),
    validate(productValidation.deleteProuductByuserId),
    productController.deleteProductByuserId,
  );

productRouter
  .route('/categories/:categoryId')
  .get(validate(productValidation.getProducts), productController.getProductsBycategoryId)
  .delete(
    auth,
    authorize('admin', 'shop'),
    validate(productValidation.deleteProuductBycategoryId),
    productController.deleteProductBycategoryId,
  );

module.exports = productRouter;
