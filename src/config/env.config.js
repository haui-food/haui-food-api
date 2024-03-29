require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/haui-food-api',
  redisURI: process.env.REDIS_URI || 'redis://localhost:6379',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@haui-food.com',
    password: process.env.ADMIN_PASSWORD || 'admin@12345',
    fullname: 'Admin Haui Food',
  },
  jwt: {
    secretAccess: process.env.JWT_SECRET_ACCESS || 'secret-access',
    expiresAccessToken: process.env.JWT_EXPIRES_ACCESS_MINUTES + 'm' || '10m',
    secretRefresh: process.env.JWT_SECRET_REFRESH || 'secret-refresh',
    expiresRefreshToken: process.env.JWT_EXPIRES_REFRESH_MINUTES + 'm' || '1000m',
  },
};

module.exports = env;
