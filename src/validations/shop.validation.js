const Joi = require('joi');

const { objectId } = require('./custom.validation');

const getShops = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

const getDetailShop = {
  params: Joi.object().keys({
    shopId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getShops,
  getDetailShop,
};
