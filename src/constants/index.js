const LANGUAGE_DEFAULT = 'en';

const LOCALES = ['en', 'vi', 'zh'];

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

const STYLE_EXPORT_EXCEL = {
  font: {
    color: '#FFFFFF',
    bold: true,
  },
  fill: {
    type: 'pattern',
    patternType: 'solid',
    fgColor: '#1ABD76',
  },
};

const KEY_CACHE_ACCESS = 'totalAccess';

const TTL_CACHE_ACCESS = 10 * 60;

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

const THIRTY_DAYS_IN_MILLISECONDS = 30 * MILLISECONDS_IN_A_DAY;

const RATING_RANGE = [3.5, 4, 4.5, 5];

const MAX_ORDER_PER_USER = 5;

const LIMIT_DEFAULT = 10;

const PAGE_DEFAULT = 1;

const LIMIT_DEFAULT_EXPORT = 10000;

const SORT_DEFAULT_STRING = 'createdAt:desc';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

module.exports = {
  LOG_DIR,
  LOCALES,
  URL_HOST,
  LOGO_SIZE,
  HOST_NAME,
  CHARACTERS,
  EMAIL_TYPES,
  COOKIE_NAME,
  TOKEN_TYPES,
  HEADER_NAME,
  QUEUE_TYPES,
  LOGO_MARGIN,
  RATING_RANGE,
  PAGE_DEFAULT,
  LOG_FILENAME,
  STATUS_FORGOT,
  LIMIT_DEFAULT,
  LOGO_DOTS_COLOR,
  TTL_CACHE_ACCESS,
  KEY_CACHE_ACCESS,
  LANGUAGE_DEFAULT,
  REQUEST_USER_KEY,
  PATH_API_DEFAULT,
  LOGO_QRCODE_NAME,
  LOGO_IMAGE_MARGIN,
  TIME_CACHE_DEFAULT,
  LENGTH_OTP_DEFAULT,
  STYLE_EXPORT_EXCEL,
  MAX_ORDER_PER_USER,
  SORT_DEFAULT_STRING,
  LIMIT_DEFAULT_EXPORT,
  EXPIRES_TOKEN_CAPTCHA,
  LOGO_BACKGROUND_COLOR,
  MILLISECONDS_IN_A_DAY,
  TIME_DIFF_EMAIL_VERIFY,
  CODE_VERIFY_2FA_SUCCESS,
  EXPIRES_TOKEN_EMAIL_VERIFY,
  THIRTY_DAYS_IN_MILLISECONDS,
  EXPIRES_TOKEN_FOTGOT_PASSWORD,
  EXPIRES_TOKEN_VERIFY_OTP_FORGOT,
};
