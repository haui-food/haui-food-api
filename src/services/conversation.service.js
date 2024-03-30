const httpStatus = require('http-status');

const { Conversation } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const { cartDetailMessage, conversationMessage } = require('../messages');

const getConversationById = async (id) => {
  const conversation = await Conversation.findById(id);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, cartDetailMessage().NOT_FOUND);
  }
  return conversation;
};

const createConversation = async (conversationBody) => {
  const { participants } = conversationBody;
  const conversation = await Conversation.findOne({ participants });
  if (conversation) {
    throw new ApiError(httpStatus.BAD_REQUEST, conversationMessage().ALREADY_EXISTS);
  }
  const newConversation = await Conversation.create(conversationBody);
  return newConversation;
};

const getConversationsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Conversation);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['participants', 'message']);
  return { conversations: results, ...detailResult };
};

const updateConversationById = async (conversationId, updateBody) => {
  const conversation = await getConversationById(conversationId);
  Object.assign(conversation, updateBody);
  await conversation.save();
  return conversation;
};

const deleteConversationById = async (conversationId) => {
  const conversation = await getConversationById(conversationId);
  await conversation.deleteOne();
  return conversation;
};

module.exports = {
  getConversationById,
  createConversation,
  getConversationsByKeyword,
  updateConversationById,
  deleteConversationById,
};
