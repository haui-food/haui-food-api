const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { categoryController } = require('../../controllers');
const { categoryValidation } = require('../../validations');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .get(validate(categoryValidation.getCategories), categoryController.getCategories)
  .post(auth, authorize('admin'), validate(categoryValidation.createCateogry), categoryController.createCategory);

categoryRouter
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategoryById)
  .put(auth, authorize('admin'), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth, authorize('admin'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = categoryRouter;
