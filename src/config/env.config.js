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
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.SMTP_USERNAME,
  },
  rateLimit: {
    timeApp: process.env.RATE_LIMIT_TIME_APP || 5,
    totalApp: process.env.RATE_LIMIT_TOTAL_APP || 100,
    timeAuth: process.env.RATE_LIMIT_TIME_AUTH || 3,
    totalAuth: process.env.RATE_LIMIT_TOTAL_AUTH || 15,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  image: {
    folderName: 'haui-food',
    typeAllow: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    maxFileSize: (process.env.MAX_FILE_SIZE_IMAGE_MB || 3) * 1024 * 1024,
  },
};

module.exports = env;
