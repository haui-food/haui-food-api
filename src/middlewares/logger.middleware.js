const path = require('path');
const fs = require('fs').promises;

const catchAsync = require('../utils/catchAsync');
const getInfoClient = require('../utils/getInfoClient');
const { LOG_DIR, LOG_FILENAME } = require('../constants');

const pathFileLog = path.join(__dirname, '../../', LOG_DIR, LOG_FILENAME);

const getCurrentDate = () => {
  const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
  return currentDate;
};

const sendLogToFile = async (message) => {
  await fs.appendFile(pathFileLog, message + '\n');
};

const logUnauthenticatedRequest = catchAsync(async (req, res, next) => {
  const isAuth = req[REQUEST_USER_KEY] ? true : false;

  if (isAuth) return next();

  const { userIP } = getInfoClient(req);

  const message = `${getCurrentDate()} - ${req.method} ${req.originalUrl} - Anonymous|${userIP}`;

  await sendLogToFile(message);

  next();
});

const logAuthenticatedRequest = catchAsync(async (req, res, next) => {
  const { userEmail, userIP } = getInfoClient(req);

  const message = `${getCurrentDate()} - ${req.method} ${req.originalUrl} - ${userEmail}|${userIP}`;

  await sendLogToFile(message);

  next();
});

module.exports = { logUnauthenticatedRequest, logAuthenticatedRequest };
