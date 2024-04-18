const express = require('express');

const { uploadService } = require('../../services');
const { authController } = require('../../controllers');
const { authValidation } = require('../../validations');
const { auth } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { rateLimitAuth } = require('../../middlewares/rate-limit.middleware');
const { logAuthenticatedRequest } = require('../../middlewares/logger.middleware');

const authRouter = express.Router();

authRouter
  .route('/me')
  .get(auth, logAuthenticatedRequest, authController.getMe)
  .put(
    auth,
    logAuthenticatedRequest,
    uploadService.uploadImage.single('avatar'),
    validate(authValidation.updateMe),
    authController.updateMe,
  );

authRouter.use(rateLimitAuth);

authRouter.route('/login').post(validate(authValidation.login), authController.login);

authRouter.route('/register').post(validate(authValidation.register), authController.register);

authRouter.route('/refresh-tokens').post(validate(authValidation.refreshToken), authController.refreshToken);

authRouter.route('/change-password').post(auth, validate(authValidation.changePassword), authController.changePassword);

authRouter.route('/login-with-2fa').post(validate(authValidation.loginWith2FA), authController.loginWith2FA);

authRouter
  .route('/toggle-2fa')
  .post(auth, validate(authValidation.toggle2FA), authController.toggleTwoFactorAuthentication);

authRouter.post('/generate-2fa-secret', auth, logAuthenticatedRequest, authController.generate2FASecret);

authRouter.post(
  '/change-2fa-secret',
  auth,
  logAuthenticatedRequest,
  validate(authValidation.change2FASecret),
  authController.change2FASecret,
);

module.exports = authRouter;
