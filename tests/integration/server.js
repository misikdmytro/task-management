const path = require('path');
const app = require('../../src/app');
const db = require('../../src/db');
const { createConfig } = require('../../src/config/config');
const logger = require('../../src/config/logger');

const setupServer = () => {
  let server;

  const configPath = path.join(__dirname, '../../configs/tests.env');
  const config = createConfig(configPath);

  beforeAll(async () => {
    logger.init(config);
    await db.init(config);

    await new Promise((resolve) => {
      server = app.listen(config.port, () => {
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });

    await db.destroy();
    logger.destroy();
  });
};

module.exports = {
  setupServer,
};
