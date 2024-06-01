const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { dashboardService } = require('../services');
const { dashboardMessage } = require('../messages');

const statisticalUserByRole = catchAsync(async (req, res) => {
  const result = await dashboardService.statisticalUserByRole();
  res.status(httpStatus.OK).json(response(httpStatus.OK, dashboardMessage().STATISTICAL_USER_BY_ROLE, result));
});

const statisticalData = catchAsync(async (req, res) => {
  const result = await dashboardService.statisticalData(req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, dashboardMessage().STATISTICAL_DATA, result));
});

module.exports = {
  statisticalUserByRole,
  statisticalData,
};
