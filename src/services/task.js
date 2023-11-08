const Task = require('../models/task');

function getTaskById(id) {
  return Task.findById(id);
}

function createTask(name, description) {
  return Task.create({ name, description });
}

module.exports = {
  getTaskById,
  createTask,
};
