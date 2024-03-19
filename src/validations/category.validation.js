const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCateogry = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().allow(null, ''),
    decription: Joi.string().allow(null, ''),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      image: Joi.string().allow(null, ''),
      decription: Joi.string().allow(null, ''),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCateogry,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
