const { version } = require('../../package.json');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Task API',
    version,
    description: 'Task API',
    license: {
      name: 'MIT',
    },
    contact: {
      name: 'Task API',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001/',
      description: 'Development server',
    },
  ],
};

module.exports = swaggerDefinition;
