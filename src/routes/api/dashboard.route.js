const express = require('express');

const { dashboardController } = require('../../controllers');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const chatRouter = express.Router();
chatRouter
  .route('/statistical-user')
  .get(auth, authorize(['shop', 'admin']), dashboardController.statisticalUserByRole);

<<<<<<< HEAD
chatRouter.route('/statistical-data').post(auth, authorize(['admin']), dashboardController.statisticalData);

chatRouter.route('/statistical-revenue').post(auth, authorize(['admin']), dashboardController.statisticalRevenue);

chatRouter
  .route('/statistical-performance')
  .post(auth, authorize(['admin']), dashboardController.statisticalPerformance);
=======
chatRouter.route('/statistical-data').get(auth, authorize(['shop', 'admin']), dashboardController.statisticalData);

chatRouter
  .route('/statistical-revenue')
  .get(auth, authorize(['shop', 'admin']), dashboardController.statisticalRevenue);

chatRouter
  .route('/statistical-performance')
  .get(auth, authorize(['shop', 'admin']), dashboardController.statisticalPerformance);
>>>>>>> cf864f20bc4811a7c3a5835de4d9974c0e3a85dc

module.exports = chatRouter;
