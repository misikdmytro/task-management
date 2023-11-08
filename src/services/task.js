const Task = require('../models/task');

function createTask(name, description) {
  return Task.create({ name, description });
}

module.exports = {
  createTask,
};
