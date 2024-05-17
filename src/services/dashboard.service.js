const { User } = require('../models');

const statisticalUserByRole = async () => {
  const result = await User.aggregate([
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
  const roles = result.map((item) => {
    total += item.count;
    return { [item._id]: item.count };
  });

  return {
    total: total,
    roles: roles,
  };
};

module.exports = { statisticalUserByRole };
