const httpStatus = require('http-status');

const response = require('../utils/response');
const { shopService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getShops = catchAsync(async (req, res) => {
  const result = await shopService.getShops(req.query);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Danh sách cửa hàng', { ...result }));
});

const getDetailShop = catchAsync(async (req, res) => {
  const { shopId } = req.params;

  const shop = await shopService.getDetailShop(shopId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Chi tiết cửa hàng', shop));
});

const searchRestaurants = catchAsync(async (req, res) => {
  const result = await shopService.searchRestaurants(req.query);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Kết quả tìm kiếm', { ...result }));
});

module.exports = {
  getShops,
  getDetailShop,
  searchRestaurants,
};
