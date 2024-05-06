const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { User, Product } = require('../models');

const getShops = async (requestQuery) => {
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

  const shops = await User.find(query)
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

  return { shops, ...detailResult };
};

const getDetailShop = async (id) => {
  const shop = await User.findOne({
    _id: id,
    role: 'shop',
  }).select('fullname email phone address avatar background');

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy cửa hàng');
  }

  const products = await Product.find({ shopId: id }).select('name description image price slug');

  return { shop: { ...shop.toObject(), products } };
};

module.exports = {
  getShops,
  getDetailShop,
};
