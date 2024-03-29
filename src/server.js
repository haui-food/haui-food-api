const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const apiRoute = require('./routes/api');
const { userService } = require('./services');
const baseRouter = require('./routes/base.route');
const { env, logger, morgan, i18nService } = require('./config');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());

app.use(express.json());
app.use(cookieParser());

app.use(xss());
app.use(mongoSanitize());

app.set('trust proxy', 1);

app.use(cors());
app.options('*', cors());

app.use((req, res, next) => {
  next(i18nService.setLocale(req, res));
});

if (env.nodeEnv !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use('/api/v1', apiRoute);
app.use('/', baseRouter);

app.use(errorConverter);
app.use(errorHandler);

mongoose
  .connect(env.mongoURI)
  .then(() => logger.info('MongoDB connected...'))
  .then(() => {
    userService.createAdmin();
    logger.info('Admin created...');
  })
  .then(() =>
    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    }),
  )
  .catch((err) => logger.error(err));
