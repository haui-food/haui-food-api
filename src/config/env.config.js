require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  listIPPing: process.env.LIST_IP_PING || '',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/haui-food-api',
  rabbitmqURI: process.env.RABBITMQ_URI,
  googleAIApiKey: process.env.GOOGLE_AI_API_KEY,
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@haui-food.com',
    password: process.env.ADMIN_PASSWORD || 'admin@12345',
    fullname: 'Admin Haui Food',
  },
  jwt: {
    secretAccess: process.env.JWT_SECRET_ACCESS || 'secret-access',
    expiresAccessToken: (process.env.JWT_EXPIRES_ACCESS_MINUTES || '10') + 'm',
    secretRefresh: process.env.JWT_SECRET_REFRESH || 'secret-refresh',
    expiresRefreshToken: (process.env.JWT_EXPIRES_REFRESH_MINUTES || '1000') + 'm',
    secret2FA: process.env.JWT_SECRET_2FA || 'secret-2fa',
    expires2FAToken: (process.env.JWT_EXPIRES_2FA_MINUTES || '3') + 'm',
    secretVerify: process.env.JWT_SECRET_VERIFY || 'secret-verify',
    expiresVerify: (process.env.JWT_EXPIRES_VERIFY_MINUTES || '5') + 'm',
  },
  secret: {
    tokenVerify: process.env.SECRET_TOKEN_VERIFY || 'secret-verify',
    tokenForgot: process.env.SECRET_TOKEN_FORGOT || 'secret-forgot',
    tokenCapcha: process.env.SECRET_TOKEN_CAPCHA || 'secret-capcha',
    tokenVerifyOTP: process.env.SECRET_TOKEN_VERIFY_OTP || 'secret-verify-otp',
  },
  rateLimit: {
    timeApp: +process.env.RATE_LIMIT_TIME_APP || 5,
    totalApp: +process.env.RATE_LIMIT_TOTAL_APP || 100,
    timeAuth: +process.env.RATE_LIMIT_TIME_AUTH || 3,
    totalAuth: +process.env.RATE_LIMIT_TOTAL_AUTH || 15,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  image: {
    folderName: 'haui-food',
    typeAllow: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    maxFileSize: (+process.env.MAX_FILE_SIZE_IMAGE_MB || 3) * 1024 * 1024,
  },
  file: {
    folderName: 'haui-food-file',
    typeAllow: ['.xlsx'],
    maxFileSize: (+process.env.MAX_FILE_SIZE_FILE_MB || 5) * 1024 * 1024,
  },
  apiKey: {
    mailer: process.env.API_KEY_MAILER || 'mailer',
    cronJob: process.env.API_KEY_CRON_JOB || 'cron-job',
  },
};

module.exports = env;
