const slug = require('slug');
const httpStatus = require('http-status');

const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const { categoryMessage } = require('../messages');

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, categoryMessage().NOT_FOUND);
  }
  return category;
};

const createCategory = async (categoryBody) => {
  const { name } = categoryBody;
  const category = await Category.findOne({ name });
  if (category) {
    throw new ApiError(httpStatus.BAD_REQUEST, categoryMessage().ALREADY_EXISTS);
  }
  const newCategory = await Category.create(categoryBody);
  return newCategory;
};

const getCategoriesByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Category);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'description']);
  return { categories: results, ...detailResult };
};

const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  await category.deleteOne();
  return category;
};

module.exports = {
  getCategoryById,
  createCategory,
  getCategoriesByKeyword,
  updateCategoryById,
  deleteCategoryById,
};
