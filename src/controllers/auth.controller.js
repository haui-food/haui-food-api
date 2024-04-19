const httpStatus = require('http-status');

const response = require('../utils/response');
const { authMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const { REQUEST_USER_KEY } = require('../constants');
const { authService, userService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken, twoFaToken } = await authService.login(email, password);
  if (user.is2FA) {
    return res
      .status(httpStatus.ACCEPTED)
      .json(response(httpStatus.ACCEPTED, authMessage().PLEASE_BYPASS_2FA, { twoFaToken }));
  }
  res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, authMessage().LOGIN_SUCCESS, { user, accessToken, refreshToken }));
});

const register = catchAsync(async (req, res) => {
  const { fullname, email, password } = req.body;
  await authService.register(fullname, email, password);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, authMessage().REGISTER_SUCCESS));
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const { accessToken } = await authService.refreshToken(refreshToken);
  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().REFRESH_TOKEN_SUCCESS, { accessToken }));
});

const getMe = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().GET_ME_SUCCESS, req[REQUEST_USER_KEY]));
});

const updateMe = catchAsync(async (req, res) => {
  if (req.file) req.body['avatar'] = req.file.path;
  const user = await userService.updateUserById(req[REQUEST_USER_KEY].id, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().UPDATE_ME_SUCCESS, user));
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await authService.changePassword(req[REQUEST_USER_KEY].id, oldPassword, newPassword);
  return res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().CHANGE_PASSWORD_SUCCESS, user));
});

const toggleTwoFactorAuthentication = catchAsync(async (req, res) => {
  const user = await authService.toggleTwoFactorAuthentication(req[REQUEST_USER_KEY].id, req.body.code);
  return res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, user.is2FA ? authMessage().ON_2FA_SUCCESS : authMessage().OFF_2FA_SUCCESS, user));
});

const loginWith2FA = catchAsync(async (req, res) => {
  const { token2FA, code } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginWith2FA(token2FA, code);
  res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, authMessage().LOGIN_SUCCESS, { user, accessToken, refreshToken }));
});

const generate2FASecret = catchAsync(async (req, res) => {
  const secret = authService.generate2FASecret();
  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().GENERATE_2FA_SUCCESS, { secret }));
});

const change2FASecret = catchAsync(async (req, res) => {
  const { secret, code } = req.body;
  const user = await authService.change2FASecret(req[REQUEST_USER_KEY].id, secret, code);
  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().CHANGE_2FA_SUCCESS, user));
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  await authService.verifyEmail(token);
  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().VERIFY_EMAIL_SUCCESS));
});

module.exports = {
  getMe,
  login,
  register,
  verifyEmail,
  refreshToken,
  updateMe,
  changePassword,
  toggleTwoFactorAuthentication,
  loginWith2FA,
  generate2FASecret,
  change2FASecret,
};
