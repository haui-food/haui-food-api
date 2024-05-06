const httpStatus = require('http-status');

const { messageMessage } = require('../messages');
const { Message, Conversation } = require('../models');
const { getReceiverSocketId } = require('../sockets/socket');

const sendMessage = async (chatBody) => {
  const { sender, receiver, message } = chatBody;

  const conversation = await Conversation.findOne({ participants: { $all: [sender, receiver] } });
  if (!conversation) {
    const conversation = await Conversation.create({ participants: [sender, receiver] });
  }

  const newMessage = await Message.create({ sender, receiver, message });
  if (newMessage) {
    conversation.message.push(newMessage._id);
  }

  await Promise.all([conversation.save(), newMessage.save()]);
  const receiverSocketId = getReceiverSocketId(receiver);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  return newMessage;
};

const getMessage = async (chatBody) => {
  const { sender, receiver } = chatBody;

  const conversation = await Conversation.findOne({ participants: { $all: [sender, receiver] } }).populate('message');

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, messageMessage().NOT_FOUND);
  }

  return conversation.message;
};

module.exports = {
  sendMessage,
  getMessage,
};
