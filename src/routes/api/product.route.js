const express = require('express');

const { uploadService } = require('../../services');
const { productController } = require('../../controllers');
const { productValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter
  .route('/')
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(
    auth,
    authorize('shop'),
    uploadService.uploadImage.single('image'),
    validate(productValidation.createProduct),
    productController.createProduct,
  );

productRouter.get(
  '/exports',
  auth,
  authorize('admin'),
  validate(productValidation.getProducts),
  productController.exportExcel,
);

productRouter.get(
  '/me',
  auth,
  authorize('shop'),
  validate(productValidation.getProducts),
  productController.getMyProducts,
);

productRouter
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProductById)
  .put(
    auth,
    authorize('shop'),
    uploadService.uploadImage.single('image'),
    validate(productValidation.updateProduct),
    productController.updateProduct,
  )
  .delete(auth, authorize('shop'), validate(productValidation.deleteProuduct), productController.deleteProduct);

module.exports = productRouter;
