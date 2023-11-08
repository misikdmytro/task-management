const Joi = require('joi');

const getTaskById = {
  params: Joi.object().keys({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

const createTask = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  }),
};

module.exports = {
  getTaskById,
  createTask,
};
