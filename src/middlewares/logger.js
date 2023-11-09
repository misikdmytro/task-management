const onHeaders = require('on-headers');
const logger = require('../config/logger');

function loggerMiddleware(req, res, next) {
  const started = new Date();
  logger.debug('request received', { url: req.url, method: req.method, body: req.body });

  onHeaders(res, () => {
    logger.info('response sent', {
      url: req.url,
      method: req.method,
      statusCode: res.statusCode,
      duration: new Date() - started,
    });
  });

  next();
}

module.exports = loggerMiddleware;
