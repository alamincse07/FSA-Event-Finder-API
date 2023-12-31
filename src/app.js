const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const OpenApiValidator = require('express-openapi-validator');
const httpStatus = require('http-status');
const config = require('./config/appConfig');
const morgan = require('./config/morgan');

const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const docsRoute = require('./routes/v1/docs');
const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.all('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Event Finder API, visit /docs to get the documentation',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 200,
  });
});

// serve the docs ui
app.use('/docs', docsRoute);
// Use tjhe open api validator initially but also  apply the joi validation where ever needed
app.use(
  OpenApiValidator.middleware({
    apiSpec: config.swaggerPath,
    validateRequests: {
      allowUnknownQueryParameters: true,
    },
    validateResponses: false,
  })
);

app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  console.log('ppp');
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
