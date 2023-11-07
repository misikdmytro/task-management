const mongoose = require('mongoose');
const app = require('../../src/app');
const config = require('./config');
const logger = require('../../src/config/logger');

async function create() {
  await mongoose.connect(config.mongo.url);

  return new Promise((resolve) => {
    const server = app.listen(config.port, () => {
      logger.info('app started', { port: config.port });
      resolve(server);
    });
  });
}

function destroy(server) {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

module.exports = {
  create,
  destroy,
};
