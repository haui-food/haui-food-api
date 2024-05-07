const httpStatus = require('http-status');

const response = require('../utils/response');
const { shopService } = require('../services');
const { shopMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');

const getShops = catchAsync(async (req, res) => {
  const result = await shopService.getShops(req.query);

  res.status(httpStatus.OK).json(response(httpStatus.OK, shopMessage().FIND_SUCCESS, { ...result }));
});

const getDetailShop = catchAsync(async (req, res) => {
  const { shopId } = req.params;

  const shop = await shopService.getDetailShop(shopId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, shopMessage().SHOP_DETAIL, shop));
});

const getDetailShopGroupByCategory = catchAsync(async (req, res) => {
  const { shopId } = req.params;

  const shop = await shopService.getShopDetailByIdAndGroupByCategory(shopId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, shopMessage().SHOP_DETAIL, shop));
});

const searchRestaurants = catchAsync(async (req, res) => {
  const result = await shopService.searchRestaurants(req.query);

  res.status(httpStatus.OK).json(response(httpStatus.OK, shopMessage().RESULT_FIND, { ...result }));
});

const getShopsByCategory = catchAsync(async (req, res) => {
  const shops = await shopService.getShopsByCategory(req.query, req.params.categoryId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, shopMessage().FIND_BY_CATEGORY, shops));
});

module.exports = {
  getShops,
  getDetailShop,
  searchRestaurants,
  getShopsByCategory,
  getDetailShopGroupByCategory,
};
