const fs = require('fs');
const path = require('path');

const catchAsync = require('../utils/catchAsync');
const getInfoClient = require('../utils/getInfoClient');
const { LOG_DIR, LOG_FILENAME } = require('../constants');

const pathFileLog = path.join(__dirname, '../../', LOG_DIR, LOG_FILENAME);

const getCurrentDate = () => {
  const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
  return currentDate;
};

const sendLogToFile = (message) => {
  fs.appendFileSync(pathFileLog, message + '\n');
};

const logUnauthenticatedRequest = catchAsync(async (req, res, next) => {
  const isAuth = req.headers?.authorization ? true : false;

  const isLog = req.originalUrl.toLowerCase() === '/logs';

  if (isAuth || isLog) return next();

  const { userIP } = getInfoClient(req);

  const message = `${getCurrentDate()} - ${req.method} ${req.originalUrl} - Anonymous|${userIP}`;

  sendLogToFile(message);

  next();
});

const logAuthenticatedRequest = catchAsync(async (req, res, next) => {
  const { userEmail, userIP } = getInfoClient(req);

  const message = `${getCurrentDate()} - ${req.method} ${req.originalUrl} - ${userEmail}|${userIP}`;

  sendLogToFile(message);

  next();
});

module.exports = { logUnauthenticatedRequest, logAuthenticatedRequest };
