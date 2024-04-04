const express = require('express');

const { productController } = require('../../controllers');
const { productValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(auth, authorize('shop'), validate(productValidation.createProduct), productController.createProduct);

productRouter.route('/export').get(validate(productValidation.getProducts), productController.exportExcel);

productRouter
  .route('/me')
  .get(auth, authorize('shop'), validate(productValidation.getProducts), productController.getMyProducts);

productRouter
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProductById)
  .put(auth, authorize('shop'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth, authorize('shop'), validate(productValidation.deleteProuduct), productController.deleteProduct);

module.exports = productRouter;
