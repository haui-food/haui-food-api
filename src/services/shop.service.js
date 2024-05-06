const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { shopMessage } = require('../messages');
const { User, Product } = require('../models');
const { RATING_RANGE } = require('../constants');
const cacheService = require('../services/cache.service');
const objectToString = require('../utils/objectToString');

const getShops = async (requestQuery) => {
  const key = objectToString(requestQuery);

  const shopsCache = cacheService.get(key);

  if (shopsCache) return shopsCache;

  const { limit = 10, page = 1, keyword = '' } = requestQuery;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const query = {
    $and: [
      { role: 'shop' },
      {
        $or: [
          { phone: { $regex: new RegExp(keyword, 'i') } },
          { address: { $regex: new RegExp(keyword, 'i') } },
          { fullname: { $regex: new RegExp(keyword, 'i') } },
        ],
      },
    ],
  };

  let shops = await User.find(query)
    .select('fullname email phone address avatar background')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const totalSearch = await User.countDocuments(query);

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: shops.length,
  };

  const randomRating = () => {
    const randomIndex = Math.floor(Math.random() * RATING_RANGE.length);
    return RATING_RANGE[randomIndex];
  };

  shops = shops.map((shop) => ({
    ...shop._doc,
    rating: randomRating(),
  }));

  cacheService.set(key, { shops, ...detailResult });

  return { shops, ...detailResult };
};

const getDetailShop = async (id) => {
  const shop = await User.findOne({
    _id: id,
    role: 'shop',
  }).select('fullname email phone address avatar background');

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, shopMessage().NOT_FOUND);
  }

  const products = await Product.find({ shopId: id }).select('name description image price slug');

  return { shop: { ...shop.toObject(), products } };
};

const searchRestaurants = async (requestQuery) => {
  const { keyword = '' } = requestQuery;

  const queryShop = {
    $and: [
      { role: 'shop' },
      {
        $or: [
          { phone: { $regex: new RegExp(keyword, 'i') } },
          { address: { $regex: new RegExp(keyword, 'i') } },
          { fullname: { $regex: new RegExp(keyword, 'i') } },
        ],
      },
    ],
  };

  const queryProduct = {
    $or: [
      { name: { $regex: new RegExp(keyword, 'i') } },
      { slug: { $regex: new RegExp(keyword, 'i') } },
      { description: { $regex: new RegExp(keyword, 'i') } },
    ],
  };

  const [shops, products] = await Promise.all([
    User.find(queryShop).limit(5).select('fullname email phone address avatar background'),
    Product.find(queryProduct).limit(20).select('name description image price slug'),
  ]);

  return { shops, products };
};

module.exports = {
  getShops,
  getDetailShop,
  searchRestaurants,
};
