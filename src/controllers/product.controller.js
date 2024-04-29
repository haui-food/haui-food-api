const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { productMessage } = require('../messages');
const { REQUEST_USER_KEY } = require('../constants');

const createProduct = catchAsync(async (req, res) => {
  req.body.shopId = req[REQUEST_USER_KEY].id;

  if (req.file) req.body['image'] = req.file.path;

  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, productMessage().CREATE_SUCCESS, product));
});

const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProductsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_LIST_SUCCESS, products));
});

const getProductById = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await productService.getProductById(productId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_SUCCESS, product));
});

const getMyProducts = catchAsync(async (req, res) => {
  const shopId = req[REQUEST_USER_KEY].id;

  const products = await productService.getMyProducts(req.query, shopId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_LIST_SUCCESS, products));
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const shopId = req[REQUEST_USER_KEY].id;

  if (req.file) req.body['image'] = req.file.path;

  const product = await productService.updateProductById(productId, req.body, shopId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().UPDATE_SUCCESS, product));
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const shopId = req[REQUEST_USER_KEY].id;

  const result = await productService.deleteProductById(productId, shopId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().DELETE_SUCCESS, result));
});

const exportExcel = catchAsync(async (req, res) => {
  const wb = await productService.exportExcel(req.query);
  wb.writeToBuffer().then((buffer) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `products-hauifood.com-${Date.now()}.xlsx`);
    res.send(buffer);
  });
});

module.exports = {
  getProducts,
  exportExcel,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};
