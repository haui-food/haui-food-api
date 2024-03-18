const { Category } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { categoryMessage } = require('../messages');

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

const getCategoriesByKeyword = async (requestQuery) => {
  const { limit = 10, page = 1, keyword = '', sortBy = 'createdAt:desc' } = requestQuery;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;
  let sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return [field, option === 'desc' ? -1 : 1];
  });

  const categories = await Category.find({
    $or: [{ name: { $regex: new RegExp(keyword, 'i') } }, { description: { $regex: new RegExp(keyword, 'i') } }],
  })
    .limit(limit)
    .skip(skip)
    .sort(sort);

  const totalSearch = await Category.countDocuments({
    $or: [{ name: { $regex: new RegExp(keyword, 'i') } }, { description: { $regex: new RegExp(keyword, 'i') } }],
  });

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: categories.length,
  };

  return { categories, ...detailResult };
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
  getCategoryByName,
  getCategoryById,
  createCategory,
  getCategoriesByKeyword,
  updateCategoryById,
  deleteCategoryById,
};
