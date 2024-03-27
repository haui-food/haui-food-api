const { Category } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { categoryMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, categoryMessage().NOT_FOUND);
  }
  return category;
};

const createCategory = async (categoryBody) => {
  const category = await Category.create(categoryBody);
  return category;
};

const getCategoriesByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Category);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'image', 'description']);
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
