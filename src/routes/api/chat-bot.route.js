const express = require('express');

const { chatBotConterller } = require('../../controllers');
// const { messageValidation } = require('../../validations');
// const { auth } = require('../../middlewares/auth.middleware');
// const validate = require('../../middlewares/validate.middleware');

const chatBotRouter = express.Router();

chatBotRouter
  .route('/')
  .post(chatBotConterller.chatBot);

module.exports = chatBotRouter;
