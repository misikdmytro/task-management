const { faker } = require('@faker-js/faker');
const Task = require('../../../src/models/task');
const taskService = require('../../../src/services/task');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task', async () => {
      const name = faker.string.uuid();
      const description = faker.lorem.sentence();
      jest.spyOn(Task, 'create').mockResolvedValue({ name, description });
      const result = await taskService.createTask(name, description);
      expect(result.name).toEqual(name);
      expect(result.description).toEqual(description);
      expect(Task.create).toBeCalledWith({ name, description });
    });
  });
});
