const express = require('express');
const authRoute = require('./auth');
const userRoute = require('./user');
const addressRoute = require('./address');
const eventRoute = require('./event');

const config = require('../../config/appConfig');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/address',
    route: addressRoute,
  },
  {
    path: '/events',
    route: eventRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/me',
    route: eventRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
