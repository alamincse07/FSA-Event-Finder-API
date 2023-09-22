const { version } = require('../../package.json');
const config = require('../config/appConfig');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Event Finder API',
    version,
    license: {
      name: 'MIT',
      url: '#github url',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
  yaml: true,
};

module.exports = swaggerDef;
