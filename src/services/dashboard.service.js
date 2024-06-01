const { User, Order, Contact } = require('../models');
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

const statisticalData = async (reqBody) => {
  const { startDate, endDate } = reqBody;
  const cacheKey = `${startDate}:${endDate}:statisticalData`;
  const resultCache = await cacheService.get(cacheKey);

  if (resultCache) return resultCache;

  const allPossibleStatuses = Order.schema.path('status').enumValues;

  const collections = {
    sales: {
      collection: Order,
      groupField: { totalMoney: { $sum: '$totalMoney' } },
      totalField: 'totalMoney',
    },
    newUser: {
      collection: User,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
    order: {
      collection: Order,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
    message: {
      collection: Contact,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
    statusOrder: {
      collection: Order,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
  };

  const results = {};

  for (const [key, { collection, groupField, totalField }] of Object.entries(collections)) {
    const data = await collection.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate + 'T00:00:00Z'),
            $lte: new Date(endDate + 'T23:59:59Z'),
          },
        },
      },
      key === 'statusOrder'
        ? {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          }
        : {
            $group: {
              _id: null,
              ...groupField,
            },
          },
    ]);

    if (key === 'statusOrder') {
      const statusCounts = data.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      results[key] = allPossibleStatuses.reduce((acc, status) => {
        acc[status] = statusCounts[status] || 0;
        return acc;
      }, {});
    } else {
      results[key] = data.length > 0 ? data[0][totalField] : 0;
    }
  }

  cacheService.set(cacheKey, results);
  return results;
};

module.exports = { statisticalUserByRole, statisticalData };
