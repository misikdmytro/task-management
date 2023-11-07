const Joi = require('joi');

const createTask = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  createTask,
};
