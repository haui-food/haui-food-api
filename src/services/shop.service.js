const { User } = require('../models');

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

module.exports = {
  getShops,
};
