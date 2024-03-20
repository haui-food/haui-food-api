const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { categoryController } = require('../../controllers');
const { categoryValidation } = require('../../validations');
const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .get(validate(categoryValidation.getCategories), categoryController.getCategories)
  .post(validate(categoryValidation.createCateogry), categoryController.createCategory);

categoryRouter
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategoriesById)
  .put(validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = categoryRouter;
