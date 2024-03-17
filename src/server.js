const express = require('express');
const mongoose = require('mongoose');
const { env, logger, morgan, i18nService } = require('./config');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status');
const { systemMessage } = require('./messages');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
  next(i18nService.setLocale(req, res));
});

if (env.nodeEnv !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.get('/', (req, res) => {
  res.send('Server HaUI Food is running 🎉');
});

app.get('/locales/:lang', (req, res) => {
  res.cookie('lang', req.params.lang);
  res.redirect('/');
});

app.all('*', (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, systemMessage().RESOURCE_NOT_FOUND));
});

app.use(errorConverter);
app.use(errorHandler);

mongoose
  .connect(env.mongoURI)
  .then(() => logger.info('MongoDB Connected...'))
  .then(() =>
    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    }),
  )
  .catch((err) => logger.error(err));
