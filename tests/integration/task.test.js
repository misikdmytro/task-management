const { faker } = require('@faker-js/faker');
const fetch = require('node-fetch');
const { setupServer } = require('./server');
const config = require('../common/config');

setupServer();

describe('Task', () => {
  const baseUrl = `http://${config.host}:${config.port}/v1/tasks`;

  describe('get', () => {
    it('should return 404', async () => {
      const response = await fetch(`${baseUrl}/${faker.database.mongodbObjectId()}`);
      expect(response.status).toEqual(404);

      const result = await response.json();
      expect(result.task).toBeUndefined();
      expect(result.success).toEqual(false);
      expect(result.message).toEqual('Task not found');
    });

    describe('should return 400', () => {
      const data = [
        {
          name: 'number',
          id: '1234567890',
        },
        {
          name: 'uuid',
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        {
          name: 'string',
          id: 'abc',
        },
      ];

      data.forEach(({ name, id }) => {
        it(name, async () => {
          const response = await fetch(`${baseUrl}/${id}`);
          expect(response.status).toEqual(400);

          const result = await response.json();
          expect(result.task).toBeUndefined();
          expect(result.success).toEqual(false);
          expect(result.message).toEqual(
            `"id" with value "${id}" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`,
          );
        });
      });
    });
  });

  describe('create & get', () => {
    const data = [
      {
        name: 'english',
        taskName: 'Task 1',
        description: 'Task 1 description',
      },
      {
        name: 'japanese',
        taskName: 'タスク 1',
        description: 'タスク 1 説明',
      },
      {
        name: 'chinese',
        taskName: '任务 1',
        description: '任务 1 描述',
      },
      {
        name: 'emoji',
        taskName: '👍',
        description: '👍',
      },
    ];

    data.forEach((item) => {
      it(`should create a task with ${item.name}`, async () => {
        let response = await fetch(baseUrl, {
          method: 'put',
          body: JSON.stringify({
            name: item.taskName,
            description: item.description,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        expect(response.status).toEqual(201);

        const result = await response.json();

        expect(result.task).not.toBeNull();
        expect(result.success).toEqual(true);
        expect(result.task.id).not.toBeNull();
        expect(result.task.name).toEqual(item.taskName);
        expect(result.task.description).toEqual(item.description);
        expect(result.task.status).toEqual('new');
        expect(new Date() - new Date(result.task.createdAt)).toBeLessThan(1000);
        expect(result.task.updatedAt).toBeUndefined();

        response = await fetch(`${baseUrl}/${result.task.id}`);

        expect(response.status).toEqual(200);

        const result2 = await response.json();

        expect(result2.task).not.toBeNull();
        expect(result2.success).toEqual(true);
        expect(result2.task.id).toEqual(result.task.id);
        expect(result2.task.name).toEqual(item.taskName);
        expect(result2.task.description).toEqual(item.description);
        expect(result2.task.status).toEqual('new');
        expect(result2.task.createdAt).toEqual(result.task.createdAt);
        expect(result2.task.updatedAt).toBeUndefined();
      });
    });
  });
});
