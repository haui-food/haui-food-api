const { User } = require('../models');
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

module.exports = { statisticalUserByRole };
