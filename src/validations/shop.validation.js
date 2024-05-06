const Joi = require('joi');

const getShops = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

module.exports = {
  getShops,
};
