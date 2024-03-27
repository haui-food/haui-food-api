const httpStatus = require('http-status');

const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { productMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

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

const getProductsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Product);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'price', 'description']);
  return { products: results, ...detailResult };
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  await product.deleteOne();
  return product;
};

const deleteProductsByUserId = async (userId) => {
  const product = await Product.deleteMany({ userId });
  return product;
};

const deleteProductsByCategoryId = async (categoryId) => {
  const product = await Product.deleteMany({ categoryId });
  return product;
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
