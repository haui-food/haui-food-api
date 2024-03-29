const express = require('express');
const { userController } = require('../../controllers');
const { userValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const userRouter = express.Router();
userRouter.use(auth);
userRouter.use(authorize('admin'));

userRouter
  .route('/')
  .get(validate(userValidation.getUsers), userController.getUsers)
  .post(validate(userValidation.createUser), userController.createUser);

userRouter.route('/exports').get(validate(userValidation.getUsers), userController.exportExcel);

userRouter
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser)
  .put(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser)
  .options(validate(userValidation.lockUser), userController.lockUser);

module.exports = userRouter;
