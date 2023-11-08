const taskService = require('../services/task');
const catchAsync = require('../middlewares/catchAsync');

function toDto(task) {
  const {
    id, name, description, status, createdAt, updatedAt,
  } = task;

  return {
    id,
    name,
    description,
    status,
    createdAt,
    updatedAt,
  };
}

const getTaskById = catchAsync(async (req, res) => {
  const result = await taskService.getTaskById(req.params.id);

  if (result) {
    res.status(200).json({ success: true, task: toDto(result) });
  } else {
    res.status(404).json({ success: false, message: 'Task not found' });
  }
});

const createTask = catchAsync(async (req, res) => {
  const result = await taskService.createTask(req.body.name, req.body.description);

  res.status(201).json({
    success: true,
    task: toDto(result),
  });
});

module.exports = {
  getTaskById,
  createTask,
};
