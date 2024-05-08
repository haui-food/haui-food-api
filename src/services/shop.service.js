const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { RATING_RANGE } = require('../constants');
const { User, Product, Category } = require('../models');
const cacheService = require('../services/cache.service');
const objectToString = require('../utils/objectToString');
const { shopMessage, categoryMessage } = require('../messages');

const getShops = async (requestQuery) => {
  const key = objectToString(requestQuery);

  const shopsCache = cacheService.get(`${key}:shops`);

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
    .select('fullname email phone address avatar background description')
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

  cacheService.set(`${key}:shops`, { shops, ...detailResult });

  return { shops, ...detailResult };
};

const getDetailShop = async (id, selectProduct = true) => {
  const shopsCache = cacheService.get(`${id}:shopDetail`);

  if (shopsCache) return shopsCache;

  const shop = await User.findOne({
    _id: id,
    role: 'shop',
  }).select('fullname email phone address avatar background description');

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, shopMessage().NOT_FOUND);
  }

  if (!selectProduct) return shop;

  const products = await Product.find({ shop: id }).select('name description image price slug');

  cacheService.set(`${id}:shopDetail`, { shop: { ...shop.toObject(), products } });

  return { shop: { ...shop.toObject(), products } };
};

const getShopDetailByIdAndGroupByCategory = async (id) => {
  const shopsCache = cacheService.get(`${id}:shopDetailGroup`);

  if (shopsCache) return shopsCache;

  const shop = await User.findOne({
    _id: id,
    role: 'shop',
  }).select('fullname email phone address avatar background description');

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, shopMessage().NOT_FOUND);
  }

  const products = await Product.find({ shop: id }).select('name description image price slug category');

  const categoryIds = [...new Set(products.map((product) => product.category.toString()))];

  const categories = await Category.find({ _id: { $in: categoryIds } }).select('name slug image');

  const categoriesZ = [];

  categories.forEach((category) => {
    categoriesZ.push({ ...category.toObject(), products: [] });
  });

  products.forEach((product) => {
    const categoryIndex = categoriesZ.findIndex((category) => category._id.toString() === product.category.toString());
    const { category, ...productWithoutCategory } = product.toObject();
    categoriesZ[categoryIndex].products.push(productWithoutCategory);
  });

  cacheService.set(`${id}:shopDetailGroup`, { shop: { ...shop.toObject(), categories: categoriesZ } });

  return { shop: { ...shop.toObject(), categories: categoriesZ } };
};

const searchRestaurants = async (requestQuery) => {
  const { keyword = '' } = requestQuery;

  const searchRestaurantsCache = cacheService.get(`${keyword}:searchRestaurants`);

  if (searchRestaurantsCache) return searchRestaurantsCache;

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
    User.find(queryShop).limit(10).select('fullname email phone address avatar background description'),
    Product.find(queryProduct).limit(20).select('name description image price slug'),
  ]);

  cacheService.set(`${keyword}:searchRestaurants`, { shops, products });

  return { shops, products };
};

const getShopsByCategory = async (requestQuery, categoryId) => {
  const { limit = 10, page = 1 } = requestQuery;

  const categoryCache = cacheService.get(`${categoryId}:${limit}:${page}:category`);

  if (categoryCache) return categoryCache;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const category = await Category.findById(categoryId).select('name slug image');

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, categoryMessage().NOT_FOUND);
  }

  const products = await Product.find({ category: categoryId }).limit(+limit).skip(skip).select('shop');

  const shopIds = [...new Set(products.map((product) => product.shop.toString()))];

  const shops = await Promise.all(shopIds.map((shopId) => getDetailShop(shopId, false)));

  const detailResult = {
    limit: +limit,
    totalResult: shopIds.length,
    totalPage: Math.ceil(shopIds.length / +limit),
    currentPage: +page,
    currentResult: shops.length,
  };

  cacheService.set(`${categoryId}:${limit}:${page}:category`, { category, shops: shops, ...detailResult });

  return { category, shops: shops, ...detailResult };
};

module.exports = {
  getShops,
  getDetailShop,
  searchRestaurants,
  getShopsByCategory,
  getShopDetailByIdAndGroupByCategory,
};
