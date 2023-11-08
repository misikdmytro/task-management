const taskService = require('../services/task');
const catchAsync = require('../middlewares/catchAsync');

const createTask = catchAsync(async (req, res) => {
  const {
    name, id, createdAt, status, description, updatedAt,
  } = await taskService.createTask(
    req.body.name,
    req.body.description,
  );

  res.status(201).json({
    success: true,
    task: {
      id,
      name,
      description,
      status,
      createdAt,
      updatedAt,
    },
  });
});

module.exports = {
  createTask,
};
