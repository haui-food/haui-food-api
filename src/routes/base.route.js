const express = require('express');

const { baseController } = require('../controllers');
const { systemValidation } = require('../validations');
const validate = require('../middlewares/validate.middleware');
const authApiKey = require('../middlewares/auth-api-key.middleware');

const baseRouter = express.Router();

baseRouter.get('/', baseController.getHome);

baseRouter.all('/health-check', baseController.healthCheck);

baseRouter.get('/locales/:lang', baseController.changeLanguage);

baseRouter.get('/logs', authApiKey('cronJob'), baseController.sendLogs);

baseRouter.get('/count-access', authApiKey('cronJob'), baseController.countAccess);

baseRouter.get('/qr-code', validate(systemValidation.renderQRCode), baseController.renderQR);

baseRouter.all('*', baseController.handlerNotFound);

module.exports = baseRouter;
