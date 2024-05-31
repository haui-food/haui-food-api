const express = require('express');

const { dashboardController } = require('../../controllers');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const chatRouter = express.Router();
chatRouter.route('/statistical-user').get(auth, authorize(['admin']), dashboardController.statisticalUserByRole);

chatRouter.route('/statistical-sales').get(auth, authorize(['admin']), dashboardController.statisticalSales);

chatRouter.route('/statistical-newuser').get(auth, authorize(['admin']), dashboardController.statisticalNewUser);

chatRouter.route('/statistical-order').get(auth, authorize(['admin']), dashboardController.statisticalOrder);

chatRouter.route('/statistical-message').get(auth, authorize(['admin']), dashboardController.statisticalMessage);

module.exports = chatRouter;
