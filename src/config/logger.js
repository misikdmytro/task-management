const winston = require('winston');
const path = require('path');
const config = require('./config');

const logger = winston.createLogger({
  level: 'debug',
  defaultMeta: { service: 'task-management' },
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

module.exports = logger;

function init() {
  if (config.env !== 'development') {
    logger.info('add file transport to logger');

    logger.add(
      new winston.transports.File({
        level: 'debug',
        filename: path.join(__dirname, '../../logs/app.log'),
      }),
    );
  }
}

module.exports.init = init;
