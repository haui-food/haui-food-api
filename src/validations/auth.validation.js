const Joi = require('joi');
const { password, email, fullname, codeVerify } = require('./custom.validation');

const login = {
  body: Joi.object().keys({
    email: Joi.string().custom(email),
    password: Joi.string().custom(password),
  }),
};

const register = {
  body: Joi.object().keys({
    email: Joi.string().custom(email),
    password: Joi.string().custom(password),
    fullname: Joi.string().custom(fullname),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(password),
    newPassword: Joi.string().required(password),
  }),
};

const updateMe = {
  body: Joi.object()
    .keys({
      fullname: Joi.string().optional().custom(fullname),
      dateOfBirth: Joi.date().allow(null, '').less('now'),
      gender: Joi.string().allow('male', 'female', ''),
      avatar: Joi.string(),
    })
    .min(1),
};

const toggle2FA = {
  body: Joi.object().keys({
    code: Joi.string().optional().custom(codeVerify),
  }),
};

const loginWith2FA = {
  body: Joi.object().keys({
    code: Joi.string().custom(codeVerify),
    token2FA: Joi.string().required(),
  }),
};

const change2FASecret = {
  body: Joi.object().keys({
    secret: Joi.string().required(),
    code: Joi.string().custom(codeVerify),
  }),
};

module.exports = {
  login,
  register,
  updateMe,
  refreshToken,
  changePassword,
  toggle2FA,
  loginWith2FA,
  change2FASecret,
};
