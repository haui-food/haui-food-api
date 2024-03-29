const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { productMessage } = require('../messages');

const createProduct = catchAsync(async (req, res) => {
  req.body.shopId = req.user.id;
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, productMessage().CREATE_SUCCESS, product));
});

const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProductsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_LIST_SUCCESS, products));
});

const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_SUCCESS, product));
});

const getMyProducts = catchAsync(async (req, res) => {
  const products = await productService.getMyProducts(req.user.id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_LIST_SUCCESS, products));
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body, req.user.id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().UPDATE_SUCCESS, product));
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await productService.deleteProductById(req.params.productId, req.user.id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().DELETE_SUCCESS, result));
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
};
