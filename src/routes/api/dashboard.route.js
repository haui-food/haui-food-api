const express = require('express');

const { dashboardController } = require('../../controllers');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const chatRouter = express.Router();
chatRouter
  .route('/statistical-user')
  .get(auth, authorize(['shop', 'admin']), dashboardController.statisticalUserByRole);

chatRouter.route('/statistical-data').get(auth, authorize(['shop', 'admin']), dashboardController.statisticalData);

chatRouter
  .route('/statistical-revenue')
  .get(auth, authorize(['shop', 'admin']), dashboardController.statisticalRevenue);

chatRouter
  .route('/statistical-performance')
  .get(auth, authorize(['shop', 'admin']), dashboardController.statisticalPerformance);

module.exports = chatRouter;
