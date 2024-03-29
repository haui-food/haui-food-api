const Joi = require('joi');
const { password, email, fullname } = require('./custom.validation');

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

const updateMe = {
  body: Joi.object()
    .keys({
      fullname: Joi.string().optional().custom(fullname),
      dateOfBirth: Joi.date().allow(null, '').less('now'),
      gender: Joi.string().allow('male', 'female', ''),
    })
    .min(1),
};

module.exports = {
  login,
  register,
  updateMe,
  refreshToken,
};
