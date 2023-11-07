const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../config/logger');

function connect() {
  return mongoose.connect(config.mongo.url).catch((err) => {
    logger.error('error in mongo connection', { err });
    setTimeout(connect, 5000);
  });
}

const db = mongoose.connection;

db.on('connected', () => {
  logger.info('mongo connected');
});

db.on('error', (error) => {
  logger.error('error in mongo connection', { error });
  mongoose.disconnect();
});

db.on('disconnected', () => {
  logger.info('mongo disconnected');
  mongoose.connect(config.mongo.url);
});

module.exports = {
  connect,
};
