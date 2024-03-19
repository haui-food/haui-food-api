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

module.exports = {
  login,
  register,
};
