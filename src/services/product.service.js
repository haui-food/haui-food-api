const { Product } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { productMessage } = require('../messages');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, productMessage().NOT_FOUND);
  }
  return product;
};
const getProductsByuserId = async (userId) => {
  const products = await Product.find({ userId: userId });
  if (!products) {
    throw new ApiError(httpStatus.NOT_FOUND, productMessage().NOT_FOUND);
  }
  return products;
};
const getProductsBycategoryId = async (categoryId) => {
  const products = await Product.find({ categoryId: categoryId });
  if (!products) {
    throw new ApiError(httpStatus.NOT_FOUND, productMessage().NOT_FOUND);
  }
  return products;
};
const getProductsByKeyword = async (requestQuery) => {
  const { limit = 10, page = 1, keyword = '', sortBy = 'createdAt:desc' } = requestQuery;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;
  let sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return [field, option === 'desc' ? -1 : 1];
  });

  const products = await Product.find({
    $or: [{ name: { $regex: new RegExp(keyword, 'i') } }, { description: { $regex: new RegExp(keyword, 'i') } }],
  })
    .limit(limit)
    .skip(skip)
    .sort(sort);

  const totalSearch = await Product.countDocuments({
    $or: [{ name: { $regex: new RegExp(keyword, 'i') } }, { description: { $regex: new RegExp(keyword, 'i') } }],
  });

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: products.length,
  };

  return { products, ...detailResult };
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const result = await getProductById(productId);
  await result.deleteOne();
  return result;
};
const deleteProductsByUserId = async (userId) => {
  const result = await Product.deleteMany({ userId: userId });
  return result;
};
const deleteProductsByCategoryId = async (categoryId) => {
  const result = await Product.deleteMany({ categoryId: categoryId });
  return result;
};
module.exports = {
  getProductById,
  getProductsByuserId,
  getProductsBycategoryId,
  createProduct,
  getProductsByKeyword,
  updateProductById,
  deleteProductById,
  deleteProductsByUserId,
  deleteProductsByCategoryId,
};
