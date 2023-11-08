const { faker } = require('@faker-js/faker');
const Task = require('../../../src/models/task');
const taskService = require('../../../src/services/task');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TaskService', () => {
  describe('getTaskById', () => {
    it('should return a task', async () => {
      const objId = faker.string.uuid();
      const name = faker.string.uuid();
      const description = faker.lorem.sentence();
      const task = { id: objId, name, description };
      jest.spyOn(Task, 'findById').mockImplementation((id) => (objId === id ? task : undefined));
      const result = await taskService.getTaskById(objId);
      expect(result.id).toEqual(objId);
      expect(result.name).toEqual(name);
      expect(result.description).toEqual(description);
      expect(Task.findById).toBeCalledWith(objId);
    });
  });

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
