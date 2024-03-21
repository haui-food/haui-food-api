const express = require('express');

const apiRoute = express.Router();

const listRoutesApi = [
  {
    path: '/users',
    route: require('./user.route'),
  },
  {
    path: '/categories',
    route: require('./category.route'),
    // path: '/auth',
    // route: require('./auth.route'),
  },
  {
    path: '/products',
    route: require('./product.route'),
  },
];

listRoutesApi.forEach((route) => {
  apiRoute.use(route.path, route.route);
});

module.exports = apiRoute;
