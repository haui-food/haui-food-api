const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { systemMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const renderQRCode = require('../utils/renderQRCode');

const getHome = (req, res) => {
  res.send('Server HaUI Food is running 🎉');
};

const changeLanguage = (req, res) => {
  res.cookie('lang', req.params.lang);
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

const handlerNotFound = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, systemMessage().RESOURCE_NOT_FOUND));
};

module.exports = {
  getHome,
  changeLanguage,
  handlerNotFound,
  renderQR,
};
