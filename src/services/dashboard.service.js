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

const statisticalNewUser = async (reqBody) => {
  const { startDate, endDate } = reqBody;
  const resultCache = await cacheService.get(`${startDate}:${endDate}:statisticalNewUser`);

  if (resultCache) return resultCache;

  const data = await User.aggregate([
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
        count: { $sum: 1 },
      },
    },
  ]);

  const totalUser = data.reduce((total, item) => total + item.count, 0);

  const result = {
    total: totalUser,
  };

  cacheService.set(`${startDate}:${endDate}:statisticalNewUser`, result);
  return result;
};

const statisticalOrder = async (reqBody) => {
  const { startDate, endDate } = reqBody;
  const resultCache = await cacheService.get(`${startDate}:${endDate}:statisticalOrder`);

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
        count: { $sum: 1 },
      },
    },
  ]);
  const totalOrder = data.reduce((total, item) => total + item.count, 0);

  const result = {
    total: totalOrder,
  };
  cacheService.set(`${startDate}:${endDate}:statisticalOrder`, result);
  return result;
};

const statisticalMessage = async (reqBody) => {
  const { startDate, endDate } = reqBody;
  const resultCache = await cacheService.get(`${startDate}:${endDate}:statisticalMessage`);

  if (resultCache) return resultCache;

  const data = await Contact.aggregate([
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
        count: { $sum: 1 },
      },
    },
  ]);
  const totalMessage = data.reduce((total, item) => total + item.count, 0);

  const result = {
    total: totalMessage,
  };
  cacheService.set(`${startDate}:${endDate}:statisticalMessage`, result);
  return result;
};

module.exports = { statisticalUserByRole, statisticalSales, statisticalNewUser, statisticalOrder, statisticalMessage };
