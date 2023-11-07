const { connect } = require('./db');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

async function run() {
  await connect();
  const server = app.listen(config.port, () => {
    logger.info('app started', { port: config.port });
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error('unhandled error', { error });
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

run();
