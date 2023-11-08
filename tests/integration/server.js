const mongoose = require('mongoose');
const app = require('../../src/app');
const config = require('../common/config');
const logger = require('../../src/config/logger');

const setupServer = () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(config.mongo.url);

    await new Promise((resolve) => {
      server = app.listen(config.port, () => {
        logger.info('app started', { port: config.port });
        resolve();
      });
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();

    await new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });
};

module.exports = {
  setupServer,
};
