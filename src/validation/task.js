const Joi = require('joi');

const createTask = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  }),
};

module.exports = {
  createTask,
};
