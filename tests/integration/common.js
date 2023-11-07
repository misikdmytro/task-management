const { create, destroy } = require('../common/server');

const setupServer = () => {
  let server;

  beforeAll(async () => {
    server = await create();
  });

  afterAll(async () => {
    await destroy(server);
  });
};

module.exports = {
  setupServer,
};
