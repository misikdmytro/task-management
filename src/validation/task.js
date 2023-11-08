const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const getTaskById = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
};

const createTask = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  }),
};

const updateTaskById = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().valid('new', 'active', 'completed', 'cancelled').optional(),
  }),
};

module.exports = {
  getTaskById,
  createTask,
  updateTaskById,
};
