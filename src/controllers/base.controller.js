const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { systemMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const readFileLog = require('../utils/readFileLog');
const { KEY_CACHE_ACCESS } = require('../constants');
const renderQRCode = require('../utils/renderQRCode');
const cacheService = require('../services/cache.service');
const { LOG_DIR, LOG_FILENAME } = require('../constants');
const gatewayService = require('../services/gateway.service');

const pathFileLog = path.join(__dirname, '../../', LOG_DIR, LOG_FILENAME);

const sendLogToFile = (message) => {
  fs.appendFileSync(pathFileLog, message + '\n');
};

const getHome = (req, res) => {
  res.send('Server HaUI Food is running 🎉');
};

const changeLanguage = (req, res) => {
  const { lang } = req.params;

  res.cookie('lang', lang);

  res.redirect('/');
};

const see = (req, res) => {
  const { ip, language, userAgent, screenSize } = req.body;

  const message = JSON.stringify({ ip, language, userAgent, screenSize });
  sendLogToFile(message);

  res.send({ code: httpStatus.OK, message: httpStatus['200_NAME'] });
};

const renderQR = catchAsync(async (req, res) => {
  const { uri } = req.query;

  const buffer = await renderQRCode(uri);
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  });

  res.end(buffer);
});

const sendLogs = (req, res) => {
  const logs = readFileLog();
  res.send({ code: httpStatus.OK, data: { logs } });
};

const healthCheck = (req, res) => {
  res.send({ code: httpStatus.OK, message: httpStatus['200_NAME'] });
};

const countAccess = (req, res) => {
  const totalAccess = cacheService.get(KEY_CACHE_ACCESS) || 0;

  cacheService.del(KEY_CACHE_ACCESS);

  res.send({ code: httpStatus.OK, message: httpStatus['200_NAME'], totalAccess });
};

const uploadImage = (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, systemMessage().FILE_REQUIRED);
  }

  res.send({ code: httpStatus.OK, message: httpStatus['200_NAME'], url: req.file.path });
};

const sendSocketPayment = async (req, res) => {
  await gatewayService.sendSocketPayment(req.body);
  res.send({ code: httpStatus.OK, message: httpStatus['200_NAME'] });
};

const handlerNotFound = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, systemMessage().RESOURCE_NOT_FOUND));
};

module.exports = {
  see,
  getHome,
  renderQR,
  sendLogs,
  uploadImage,
  healthCheck,
  countAccess,
  changeLanguage,
  handlerNotFound,
  sendSocketPayment,
};
