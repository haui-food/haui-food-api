const httpStatus = require('http-status');

const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const { productMessage, authMessage } = require('../messages');

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

const getProductsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Product);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'description', 'slug']);
  return { products: results, ...detailResult };
};

const getMyProducts = async (query) => {
  const apiFeature = new ApiFeature(Product);
  query.shopId = query.user.id;
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'description']);
  return { products: results, ...detailResult };
};

const updateProductById = async (productId, updateBody, shopId) => {
  const product = await getProductById(productId);
  if (updateBody.shopId !== shopId) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId, shopId) => {
  const product = await getProductById(productId);
  if (product.shopId !== shopId) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }
  await product.deleteOne();
  return product;
};

module.exports = {
  getProductById,
  createProduct,
  getMyProducts,
  getProductsByKeyword,
  updateProductById,
  deleteProductById,
};
