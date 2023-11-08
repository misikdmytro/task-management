const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  logger.error('unhandled error', { error });
  res.status(500).json({ success: false });
}

module.exports = {
  errorHandler,
};
