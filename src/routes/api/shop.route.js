const express = require('express');

const { shopController } = require('../../controllers');

const shopRouter = express.Router();

shopRouter.get('/', shopController.getShops);

module.exports = shopRouter;
