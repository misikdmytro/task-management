const { faker } = require('@faker-js/faker');
const Task = require('../../../src/models/task');
const taskService = require('../../../src/services/task');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task', async () => {
      const taskName = faker.string.uuid();
      jest.spyOn(Task, 'create').mockResolvedValue({ name: taskName });
      const result = await taskService.createTask(taskName);
      expect(result.name).toEqual(taskName);
      expect(Task.create).toBeCalledWith({ name: taskName });
    });
  });
});
