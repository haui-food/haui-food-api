const express = require('express');

const { dashboardController } = require('../../controllers');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const chatRouter = express.Router();
chatRouter.route('/statistical-user').get(auth, authorize(['admin']), dashboardController.statisticalUserByRole);

chatRouter.route('/statistical-sales').get(auth, authorize(['admin']), dashboardController.statisticalSales);

chatRouter.route('/statistical-newuser').get(auth, authorize(['admin']), dashboardController.statisticalNewUser);
module.exports = chatRouter;
