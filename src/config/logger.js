const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  defaultMeta: { service: 'task-management' },
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [],
});

module.exports = logger;

function init({ env, logLevel: level }) {
  logger.add(
    new winston.transports.Console({
      level,
      silent: env === 'test',
    }),
  );

  if (env !== 'development') {
    logger.add(
      new winston.transports.File({
        level,
        filename: path.join(__dirname, '../../logs/app.log'),
      }),
    );
  }
}

function destroy() {
  logger.clear();
  logger.close();
}

module.exports.init = init;
module.exports.destroy = destroy;
