const { chatAI } = require('../config');
const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { chatBotMessage } = require('../messages');
const ApiError = require('../utils/ApiError');

const chatBot = catchAsync(async (req, res) => {
  const chat = chatAI.startChat();

  const userMessage = req.body.message;
  const result = await chat.sendMessage(userMessage);
  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, chatBotMessage().RETRY);

  const aiResponse = result.response.text();
  if (!aiResponse) throw new ApiError(httpStatus.BAD_REQUEST, chatBotMessage().RETRY);

  chatAI.addToHistory('user', userMessage);
  chatAI.addToHistory('model', aiResponse);

  return res.status(httpStatus.OK).json(response(httpStatus.OK, chatBotMessage().SUCCESS, aiResponse));
});

module.exports = { chatBot };
