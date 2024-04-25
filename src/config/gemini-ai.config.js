const { env } = require('../config');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const chatHistory = [];
const genAI = new GoogleGenerativeAI(env.googleAIApiKey);

const startChat = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' }).startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 100,
    },
  });
};

const addToHistory = async (role, message) => {
  chatHistory.push({ role: role, parts: [{ text: message }] });
};

module.exports = { startChat, addToHistory };
