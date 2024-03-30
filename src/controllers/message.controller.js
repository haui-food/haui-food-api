const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');
const { messageMessage } = require('../messages');

const createMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessage(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, messageMessage().CREATE_SUCCESS, message));
});

const getMessages = catchAsync(async (req, res) => {
  const messages = await messageService.getMessagesByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, messageMessage().FIND_LIST_SUCCESS, messages));
});

const getMessageById = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(req.params.messageId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, messageMessage().FIND_SUCCESS, message));
});

const getMessagesBysenderId = catchAsync(async (req, res) => {
  const messages = await messageService.getMessageBysenderId(req.params.senderId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, messageMessage().FIND_LIST_SUCCESS, messages));
});

const deleteMessage = catchAsync(async (req, res) => {
  const message = await messageService.deleteMessageById(req.params.messageId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, messageMessage().DELETE_SUCCESS, message));
});
const deleteMessageBysenderId = catchAsync(async (req, res) => {
  const message = await messageService.deleteMessageBysenderId(req.params.senderId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, messageMessage().DELETE_SUCCESS, message));
});
module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  getMessagesBysenderId,
  deleteMessage,
  deleteMessageBysenderId,
};
