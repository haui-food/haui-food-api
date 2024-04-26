const LANGUAGE_DEFAULT = 'en';

const LOCALES = ['en', 'vi'];

const HEADER_NAME = 'accept-language';

const COOKIE_NAME = 'lang';

const REQUEST_USER_KEY = 'user';

const PATH_API_DEFAULT = '/api/v1';

const TIME_CACHE_DEFAULT = 60;

const QUEUE_TYPES = {
  EMAIL_QUEUE: 'email_queue',
};

const CODE_VERIFY_2FA_SUCCESS = [0, 2];

const LOGO_QRCODE_NAME = 'logo-qrcode.jpg';

const LOGO_SIZE = 320;

const HOST_NAME = 'hauifood.com';

const LOGO_MARGIN = 4;

const LOGO_IMAGE_MARGIN = 7;

const LOGO_DOTS_COLOR = '#101010';

const LOGO_BACKGROUND_COLOR = '#f6f6f6';

const LOG_DIR = 'logs';

const LOG_FILENAME = 'logger.log';

const URL_HOST = {
  production: 'https://api.hauifood.com',
  development: 'http://localhost:3000',
};

const EXPIRES_TOKEN_EMAIL_VERIFY = 1000 * 60 * 10;

const EXPIRES_TOKEN_FOTGOT_PASSWORD = 1000 * 60 * 10;

const EXPIRES_TOKEN_VERIFY_OTP_FORGOT = 1000 * 60 * 10;

const EXPIRES_TOKEN_CAPTCHA = 1000 * 60 * 2;

const TIME_DIFF_EMAIL_VERIFY = 1000 * 60 * 3;

const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  TWO_FA: 'twoFA',
  VERIFY: 'verify',
  FOTGOT: 'forgot',
  VERIFY_OTP: 'verify-otp',
};

const EMAIL_TYPES = {
  VERIFY: 'verify',
  FORGOT: 'forgot-password',
  BIRTHDAY: 'birthday',
};

const STATUS_FORGOT = {
  DONE: null,
  VERIFIED: 'verified',
  VERIFY_OTP: 'verifyOTP',
};

const LENGTH_OTP_DEFAULT = 6;

module.exports = {
  LOG_DIR,
  LOCALES,
  URL_HOST,
  LOGO_SIZE,
  HOST_NAME,
  EMAIL_TYPES,
  COOKIE_NAME,
  TOKEN_TYPES,
  HEADER_NAME,
  QUEUE_TYPES,
  LOGO_MARGIN,
  LOG_FILENAME,
  STATUS_FORGOT,
  LOGO_DOTS_COLOR,
  LANGUAGE_DEFAULT,
  REQUEST_USER_KEY,
  PATH_API_DEFAULT,
  LOGO_QRCODE_NAME,
  LOGO_IMAGE_MARGIN,
  TIME_CACHE_DEFAULT,
  LENGTH_OTP_DEFAULT,
  EXPIRES_TOKEN_CAPTCHA,
  LOGO_BACKGROUND_COLOR,
  TIME_DIFF_EMAIL_VERIFY,
  CODE_VERIFY_2FA_SUCCESS,
  EXPIRES_TOKEN_EMAIL_VERIFY,
  EXPIRES_TOKEN_FOTGOT_PASSWORD,
  EXPIRES_TOKEN_VERIFY_OTP_FORGOT,
};
