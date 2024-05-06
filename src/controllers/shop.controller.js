const httpStatus = require('http-status');

const response = require('../utils/response');
const { shopService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getShops = catchAsync(async (req, res) => {
  const result = await shopService.getShops(req.query);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Danh sách cửa hàng', { ...result }));
});

module.exports = {
  getShops,
};
