const express = require('express');

const { baseController } = require('../controllers');
const { systemValidation } = require('../validations');
const validate = require('../middlewares/validate.middleware');

const baseRouter = express.Router();

baseRouter.get('/', baseController.getHome);

baseRouter.get('/logs', baseController.sendLogs);

baseRouter.all('/health', baseController.healthCheck);

baseRouter.get('/locales/:lang', baseController.changeLanguage);

baseRouter.get('/qr-code', validate(systemValidation.renderQRCode), baseController.renderQR);

baseRouter.all('*', baseController.handlerNotFound);

module.exports = baseRouter;
