const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCart = {
  body: Joi.object().keys({
    cartDetailId: Joi.array().allow(null, ''),
    userId: Joi.string().custom(objectId),
    isOrder: Joi.boolean().allow(null, ''),
    totalMoney: Joi.number().allow(null, ''),
  }),
};

const getCarts = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    cartDetailId: Joi.array().allow(null, ''),
    userId: Joi.string().custom(objectId),
    isOrder: Joi.boolean().allow(null, ''),
    totalMoney: Joi.number().allow(null, ''),
  }),
};

const getCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

const updateCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      cartDetailId: Joi.array().allow(null, ''),
      userId: Joi.string().custom(objectId),
      isOrder: Joi.boolean().allow(null, ''),
      totalMoney: Joi.number().allow(null, ''),
    })
    .min(1),
};

const deleteCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCart,
  getCarts,
  getCart,
  updateCart,
  deleteCart,
};
