const Task = require('../models/task');

async function createTask(name) {
  const task = await Task.create({ name });
  return task;
}

module.exports = {
  createTask,
};
