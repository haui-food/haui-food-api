const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');
const { authMessage } = require('../messages');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);
  res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, authMessage().LOGIN_SUCCESS, { user, accessToken, refreshToken }));
});

const register = catchAsync(async (req, res) => {
  const { fullname, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.register(fullname, email, password);
  res
    .status(httpStatus.CREATED)
    .json(response(httpStatus.CREATED, authMessage().REGISTER_SUCCESS, { user, accessToken, refreshToken }));
});

module.exports = {
  login,
  register,
};
