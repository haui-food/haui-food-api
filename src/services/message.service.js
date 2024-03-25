const { Message } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { messageMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const createMessage = async (messageBody) => {
  const message = await Message.create(messageBody);
  return message;
};

const getMessageById = async (id) => {
  const message = await Message.findById(id);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, messageMessage().NOT_FOUND);
  }
  return message;
};

const getMessageBysenderId = async (senderId) => {
  const messages = await Message.find({ senderId: senderId });
  if (!messages) {
    throw new ApiError(httpStatus.NOT_FOUND, messageMessage().NOT_FOUND);
  }
  return messages;
};

const getMessagesByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Message);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'message']);
  return { messages: results, ...detailResult };
};

const deleteMessageById = async (messageId) => {
  const message = await getMessageById(messageId);
  await message.deleteOne();
  return message;
};

module.exports = {
  createMessage,
  getMessageById,
  getMessageBysenderId,
  getMessagesByKeyword,
  deleteMessageById,
};
