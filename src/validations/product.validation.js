const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    price: Joi.number().required(),
    categoryId: Joi.string().custom(objectId),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    shopId: Joi.string().optional().custom(objectId),
    categoryId: Joi.string().optional().custom(objectId),
    name: Joi.string().allow(null, ''),
    price: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    image: Joi.string().allow(null, ''),
    slug: Joi.string().allow(null, ''),
    populate: Joi.string().allow(null, ''),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      image: Joi.string().allow(null, ''),
      description: Joi.string().allow(null, ''),
      price: Joi.number().required(),
      categoryId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteProuduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const deleteProuductByuserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteProuductBycategoryId = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProuduct,
  deleteProuductByuserId,
  deleteProuductBycategoryId,
};
