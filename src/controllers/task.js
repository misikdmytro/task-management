const taskService = require('../services/task');
const catchAsync = require('../middlewares/catchAsync');

const createTask = catchAsync(async (req, res) => {
  const { name, id, createdAt } = await taskService.createTask(req.body.name);
  res.status(201).json({ success: true, task: { id, name, createdAt } });
});

module.exports = {
  createTask,
};
