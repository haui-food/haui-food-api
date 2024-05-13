const httpStatus = require('http-status');

const response = require('../utils/response');
const { chatService } = require('../services');
const { messageMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');

const sendMessage = catchAsync(async (req, res) => {
  const message = await chatService.sendMessage(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, messageMessage().CREATE_SUCCESS, message));
});

const getMessage = catchAsync(async (req, res) => {
  const message = await chatService.getMessage(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, messageMessage().FIND_SUCCESS, message));
});

const getListUsersChat = catchAsync(async (req, res) => {
  const users = await chatService.getListUsersChat(req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, messageMessage().FIND_LIST_SUCCESS, users));
});

module.exports = {
  sendMessage,
  getMessage,
  getListUsersChat,
};
