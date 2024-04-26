const express = require('express');

const { chatBotConterller } = require('../../controllers');
const { chatBotValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');

const chatBotRouter = express.Router();

chatBotRouter.post('/', validate(chatBotValidation.sendMessage), chatBotConterller.chatBot);

module.exports = chatBotRouter;
