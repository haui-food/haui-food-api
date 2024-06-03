const base64url = require('base64url');

const { User, Order } = require('../models');

const sendSocketPayment = async (data) => {
  const { desc, amount, method } = data;
  try {
    if (method === 'recharge') {
      const user = await User.findOne({
        username: desc,
      });
      // nạp tiền
      if (user) {
        console.log(`User Id ${user._id} recharge ${amount} vnd - email ${user.email}`);
      }
    } else if (method === 'payment') {
      const listOrderCode = base64url.decode(desc).split('|');

      let userInfo;
      for (const code of listOrderCode) {
        const order = await Order.findOne({ paymentCode: code }).populate('user');
        if (order) {
          console.log(order);
          userInfo = order.user;
          order.paymentStatus = 'paid';
          await order.save();
        }
      }
      // thanh toán online
      if (userInfo) {
        console.log(`User Id ${userInfo._id} payment ${amount} vnd - email ${userInfo.email}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendSocketPayment,
};
