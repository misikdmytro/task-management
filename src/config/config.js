const dotenv = require('dotenv');
const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  })
  .unknown();

function createConfig(configPath) {
  dotenv.config({ path: configPath });

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongo: {
      url: envVars.MONGODB_URL,
    },
    logLevel: envVars.LOG_LEVEL,
  };
}

module.exports = {
  createConfig,
};
