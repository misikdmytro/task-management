const logger = require('../config/logger');
const Task = require('../models/task');

function getTaskById(id) {
  return Task.findById(id);
}

function createTask(name, description) {
  return Task.create({ name, description });
}

const availableUpdates = {
  new: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const AT_LEAST_ONE_UPDATE_REQUIRED_CODE = 0;
const INVALID_STATUS_CODE = 1;
const INVALID_STATUS_TRANSITION_CODE = 2;
const TASK_NOT_FOUND_CODE = 3;
const CONCURRENCY_ERROR_CODE = 4;

async function updateTaskById(id, { name, description, status }) {
  if (!name && !description && !status) {
    return { error: 'at least one update required', code: AT_LEAST_ONE_UPDATE_REQUIRED_CODE };
  }

  if (status && !(status in availableUpdates)) {
    return { error: 'invalid status', code: INVALID_STATUS_CODE };
  }

  for (let retry = 0; retry < 3; retry += 1) {
    // eslint-disable-next-line no-await-in-loop
    const task = await Task.findById(id);
    if (!task) {
      return { error: 'task not found', code: INVALID_STATUS_TRANSITION_CODE };
    }

    if (status) {
      const allowedStatuses = availableUpdates[task.status];
      if (!allowedStatuses.includes(status)) {
        return {
          error: `cannot update from '${task.status}' to '${status}'`,
          code: TASK_NOT_FOUND_CODE,
        };
      }
    }

    task.status = status ?? task.status;
    task.name = name ?? task.name;
    task.description = description ?? task.description;
    task.updatedAt = Date.now();

    try {
      // eslint-disable-next-line no-await-in-loop
      await task.save();
    } catch (error) {
      logger.warn('error during save', { error });
      if (error.name === 'VersionError') {
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    return task;
  }

  return { error: 'concurrency error', code: CONCURRENCY_ERROR_CODE };
}

module.exports = {
  getTaskById,
  createTask,
  updateTaskById,

  errorCodes: {
    AT_LEAST_ONE_UPDATE_REQUIRED_CODE,
    INVALID_STATUS_CODE,
    INVALID_STATUS_TRANSITION_CODE,
    TASK_NOT_FOUND_CODE,
    CONCURRENCY_ERROR_CODE,
  },
};
