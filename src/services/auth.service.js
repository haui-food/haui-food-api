const jwt = require('jsonwebtoken');
const { env } = require('../config');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userMessage, authMessage } = require('../messages');
const userService = require('./user.service');

const login = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage().INVALID_LOGIN);
  }
  if (user.isLocked) {
    throw new ApiError(httpStatus.UNAUTHORIZED, userMessage().USER_LOCKED);
  }
  const accessToken = generateToken('access', { id: user.id, email, role: user.role });
  const refreshToken = generateToken('refresh', { id: user.id });
  user.lastActive = Date.now();
  await user.save();
  user.password = undefined;
  return { user, accessToken, refreshToken };
};

const register = async (fullname, email, password) => {
  const registerData = {
    fullname,
    email,
    password,
  };
  const user = await userService.createUser(registerData);
  const accessToken = generateToken('access', { id: user.id, email, role: user.role });
  const refreshToken = generateToken('refresh', { id: user.id });
  return { user, accessToken, refreshToken };
};

const generateToken = (type, payload) => {
  const secret = type === 'access' ? env.jwt.secretAccess : env.jwt.secretRefresh;
  const expiresIn = type === 'access' ? env.jwt.expiresAccessToken : env.jwt.expiresRefreshToken;
  const token = jwt.sign({ ...payload, type }, secret, {
    expiresIn,
  });
  return token;
};

module.exports = {
  login,
  register,
};
