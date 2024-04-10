const express = require('express');

const { chatController } = require('../../controllers');
const { messageValidation } = require('../../validations');
const { auth } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');

const chatRouter = express.Router();

chatRouter
  .route('/')
  .get(auth, validate(messageValidation.getMessages), chatController.getMessage)
  .post(auth, validate(messageValidation.createMessage), chatController.sendMessage);

module.exports = chatRouter;
