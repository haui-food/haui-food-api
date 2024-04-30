const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { systemMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const readFileLog = require('../utils/readFileLog');
const { KEY_CACHE_ACCESS } = require('../constants');
const renderQRCode = require('../utils/renderQRCode');
const cacheService = require('../services/cache.service');

const getHome = (req, res) => {
  res.send('Server HaUI Food is running 🎉');
};

const changeLanguage = (req, res) => {
  const { lang } = req.params;

  res.cookie('lang', lang);

  res.redirect('/');
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

const handlerNotFound = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, systemMessage().RESOURCE_NOT_FOUND));
};

module.exports = {
  getHome,
  renderQR,
  sendLogs,
  healthCheck,
  countAccess,
  changeLanguage,
  handlerNotFound,
};
