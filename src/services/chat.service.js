const httpStatus = require('http-status');

const { messageMessage } = require('../messages');
const { Message, Conversation } = require('../models');
const { getReceiverSocketId } = require('../sockets/socket');

const sendMessage = async (chatBody) => {
  const { senderId, receiverId, message } = chatBody;

  const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
  if (!conversation) {
    const conversation = await Conversation.create({ participants: [senderId, receiverId] });
  }

  const newMessage = await Message.create({ senderId, receiverId, message });
  if (newMessage) {
    conversation.message.push(newMessage._id);
  }

  await Promise.all([conversation.save(), newMessage.save()]);
  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  return newMessage;
};

const getMessage = async (chatBody) => {
  const { senderId, receiverId } = chatBody;

  const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate(
    'message',
  );

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, messageMessage().NOT_FOUND);
  }

  return conversation.message;
};

module.exports = {
  sendMessage,
  getMessage,
};
