const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { systemMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const readFileLog = require('../utils/readFileLog');
const renderQRCode = require('../utils/renderQRCode');

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

const sendLogs = catchAsync((req, res) => {
  const logs = readFileLog();
  res.send({ code: httpStatus.OK, data: { logs } });
});

const handlerNotFound = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, systemMessage().RESOURCE_NOT_FOUND));
};

module.exports = {
  getHome,
  renderQR,
  sendLogs,
  changeLanguage,
  handlerNotFound,
};
