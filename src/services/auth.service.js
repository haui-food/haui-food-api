const jwt = require('jsonwebtoken');
const twoFactor = require('node-2fa');
const httpStatus = require('http-status');

const { env } = require('../config');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const emailService = require('./email.service');
const cryptoService = require('./crypto.service');
const tokenMappings = require('../constants/jwt.constant');
const { userMessage, authMessage } = require('../messages');
const {
  URL_HOST,
  TOKEN_TYPES,
  TIME_DIFF_EMAIL_VERIFY,
  CODE_VERIFY_2FA_SUCCESS,
  EXPIRES_TOKEN_EMAIL_VERIFY,
  EXPIRES_TOKEN_FOTGOT_PASSWORD,
} = require('../constants');

const login = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage().INVALID_LOGIN);
  }
  if (!user.isVerify) {
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage().PLEASE_VERIFY_EMAIL);
  }
  if (user.isLocked) {
    throw new ApiError(httpStatus.LOCKED, userMessage().USER_LOCKED);
  }
  if (user.is2FA) {
    const twoFaToken = generateToken(TOKEN_TYPES.TWO_FA, { id: user.id });
    return { twoFaToken, user };
  }
  const payload = { id: user.id };
  const accessToken = generateToken(TOKEN_TYPES.ACCESS, payload);
  const refreshToken = generateToken(TOKEN_TYPES.REFRESH, payload);
  user.lastActive = Date.now();
  await user.save();
  user.password = undefined;
  return { user, accessToken, refreshToken };
};

const register = async (fullname, email, password) => {
  const expires = Date.now() + EXPIRES_TOKEN_EMAIL_VERIFY;
  const registerData = {
    fullname,
    email,
    password,
    verifyExpireAt: expires,
  };
  const user = await userService.createUser(registerData);
  const tokenVerify = cryptoService.encryptObj(
    {
      expires,
      userId: user.id,
      type: TOKEN_TYPES.VERIFY,
    },
    env.secret.tokenVerify,
  );
  const linkVerify = `${URL_HOST[env.nodeEnv]}/api/v1/auth/verify?token=${tokenVerify}`;
  await emailService.sendEmail({
    emailData: {
      emails: email,
      subject: '[HaUI Food] Verify your email address',
      linkVerify,
    },
    type: 'verify',
  });
};

const refreshToken = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.secretRefresh);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
  }
  if (!payload || payload.type !== TOKEN_TYPES.REFRESH) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
  }
  const user = await userService.getUserById(payload.id);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage().INVALID_TOKEN);
  }
  if (user.isLocked) {
    throw new ApiError(httpStatus.UNAUTHORIZED, userMessage().USER_LOCKED);
  }
  payload = { id: user.id };
  const accessToken = generateToken(TOKEN_TYPES.ACCESS, payload);
  return { accessToken };
};

const generateToken = (type, payload) => {
  const { secret, expiresIn } = tokenMappings[type];
  const token = jwt.sign({ ...payload, type }, secret, {
    expiresIn,
  });
  return token;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userService.getUserById(userId);
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage().INVALID_PASSWORD);
  }
  user.password = newPassword;
  await user.save();
  user.password = undefined;
  return user;
};

const toggleTwoFactorAuthentication = async (userId, code = '') => {
  const user = await userService.getUserById(userId);
  if (!user.is2FA && !(await user.is2FAMatch(code))) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_2FA_CODE);
  }
  user.is2FA = !user.is2FA;
  await user.save();
  user.password = undefined;
  return user;
};

const loginWith2FA = async (token2FA, code) => {
  const payload = jwt.verify(token2FA, env.jwt.secret2FA);
  if (!payload || payload.type !== TOKEN_TYPES.TWO_FA) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
  }
  const user = await userService.getUserById(payload.id);
  if (!user || !(await user.is2FAMatch(code))) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_2FA_CODE);
  }
  const payloadData = { id: user.id };
  const accessToken = generateToken(TOKEN_TYPES.ACCESS, payloadData);
  const refreshToken = generateToken(TOKEN_TYPES.REFRESH, payloadData);
  user.lastActive = Date.now();
  await user.save();
  user.password = undefined;
  return { user, accessToken, refreshToken };
};

const generate2FASecret = () => {
  const { secret } = twoFactor.generateSecret();
  return secret;
};

const verify2FA = (secret, code) => {
  const result = twoFactor.verifyToken(secret, code);
  if (!result) return false;
  return CODE_VERIFY_2FA_SUCCESS.includes(result.delta);
};

const change2FASecret = async (userId, secret, code) => {
  const user = await userService.getUserById(userId);
  const result = verify2FA(secret, code);
  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_2FA_CODE);
  user.secret = secret;
  await user.save();
  user.password = undefined;
  return user;
};

const verifyEmail = async (token) => {
  const { isExpired, payload } = cryptoService.expiresCheck(token, env.secret.tokenVerify);
  if (isExpired) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN_VERIFY_EXPIRED);
  }
  const user = await userService.getUserById(payload.userId);
  if (user?.isVerify) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
  }
  user.isVerify = true;
  user.verifyExpireAt = null;
  await user.save();
  user.password = undefined;
  return user;
};

const reSendEmailVerify = async (token) => {
  const expires = Date.now() + EXPIRES_TOKEN_EMAIL_VERIFY;
  const { isExpired, payload } = cryptoService.expiresCheck(token, env.secret.tokenVerify, TIME_DIFF_EMAIL_VERIFY);
  if (!isExpired) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().PLEASE_WAIT);
  }
  const user = await userService.getUserById(payload.userId);
  if (user.isVerify) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
  }
  const tokenVerify = cryptoService.encryptObj(
    {
      expires,
      userId: user.id,
      type: TOKEN_TYPES.VERIFY,
    },
    env.secret.tokenVerify,
  );
  const linkVerify = `${URL_HOST[env.nodeEnv]}/api/v1/auth/verify?token=${tokenVerify}`;
  await emailService.sendEmail({
    emailData: {
      emails: user.email,
      subject: '[HaUI Food] Verify your email address',
      linkVerify,
    },
    type: 'verify',
  });
  user.verifyExpireAt = expires;
  await user.save();
};

const forgotPassword = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().EMAIL_NOT_EXISTS);
  }
  if (!user.isVerify) {
    throw new ApiError(httpStatus.BAD_REQUEST, authMessage().PLEASE_VERIFY_EMAIL);
  }
  const expires = Date.now() + EXPIRES_TOKEN_FOTGOT_PASSWORD;
  const OTPForgotPassword = '123456';
  const tokenForgot = cryptoService.encryptObj(
    {
      expires,
      userId: user.id,
      type: TOKEN_TYPES.FOTGOT,
    },
    env.secret.tokenForgot,
  );
  await emailService.sendEmail({
    emailData: {
      emails: email,
      subject: '[HaUI Food] Confirm OTP Forgot Password',
      otp: OTPForgotPassword,
    },
    type: 'forgot',
  });
  user.forgotExpireAt = expires;
  await user.save();
  return tokenForgot;
};

module.exports = {
  login,
  register,
  verifyEmail,
  refreshToken,
  loginWith2FA,
  changePassword,
  forgotPassword,
  change2FASecret,
  reSendEmailVerify,
  generate2FASecret,
  toggleTwoFactorAuthentication,
};
