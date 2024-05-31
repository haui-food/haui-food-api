const { User, Order } = require('../models');
const cacheService = require('../services/cache.service');

const keyDashboard = 'dashboard';

const statisticalUserByRole = async () => {
  const resultCache = await cacheService.get(`${keyDashboard}:statisticalUserByRole`);

  if (resultCache) return resultCache;

  const data = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  let total = 0;
  const roles = data.map((item) => {
    total += item.count;
    return { [item._id]: item.count };
  });

  const result = {
    total: total,
    roles: roles,
  };

  cacheService.set(`${keyDashboard}:statisticalUserByRole`, result);

  return result;
};

const statisticalSales = async (reqBody) => {
  const { startDate, endDate } = reqBody;
  const resultCache = await cacheService.get(`${startDate}:${endDate}:statisticalSales`);

  if (resultCache) return resultCache;

  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate + 'T00:00:00Z'),
          $lte: new Date(endDate + 'T23:59:59Z'),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalMoney: { $sum: '$totalMoney' },
      },
    },
  ]);

  const total = data.length > 0 ? data[0].totalMoney : 0;

  const result = {
    total: total,
  };

  cacheService.set(`${startDate}:${endDate}:statisticalSales`, result);

  return result;
};

module.exports = { statisticalUserByRole, statisticalSales };
