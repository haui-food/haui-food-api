const { chatAI } = require('../config');
const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

const chatBot = catchAsync(async (req, res) => {
  const chat = chatAI.startChat();

  const userMessage = req.body.message;

  const result = await chat.sendMessage(userMessage);
  const aiResponse = await result.response.text();

  chatAI.addToHistory('user', userMessage);
  chatAI.addToHistory('model', aiResponse);

  res.status(httpStatus.OK).json(response(httpStatus.OK, "Success", aiResponse));
});

module.exports = { chatBot };
