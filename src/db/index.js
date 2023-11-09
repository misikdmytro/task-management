const mongoose = require('mongoose');
const logger = require('../config/logger');

let mongoUrl;
async function init({ mongo: { url } }) {
  mongoUrl = url;

  try {
    await mongoose.connect(mongoUrl);
  } catch (err) {
    logger.error('error in mongo connection', { err });
    setTimeout(init, 5000);
  }
}

const db = mongoose.connection;

function destroy() {
  db.removeAllListeners();
  return mongoose.disconnect();
}

db.on('connected', () => {
  logger.info('mongo connected');
});

db.on('error', (error) => {
  logger.error('error in mongo connection', { error });
  mongoose.disconnect();
});

db.on('disconnected', () => {
  logger.info('mongo disconnected');
  init({ mongo: { url: mongoUrl } });
});

module.exports = {
  init,
  destroy,
};
