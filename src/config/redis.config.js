const { createClient } = require('redis');
const env = require('./env.config');
const logger = require('./logger.config');

const client = createClient({ url: env.redisURI });

client.on('connect', () => logger.info(`Redis connected...`));

client.on('error', (err) => logger.error('Redis Client Error', err));

client.connect();

module.exports = client;
