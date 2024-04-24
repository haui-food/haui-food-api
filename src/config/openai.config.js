const { env } = require('./env.config');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = { openai };
