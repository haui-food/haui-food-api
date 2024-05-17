const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { dashboardService } = require('../services');

const statisticalUserByRole = catchAsync(async (req, res) => {
  const result = await dashboardService.statisticalUserByRole();
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Statistical user by role', result));
});

module.exports = {
  statisticalUserByRole,
};
