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
      expect(result.message).toEqual('task not found');
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
    describe('should create & return a task', () => {
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

      data.forEach(({ name, taskName, description }) => {
        it(name, async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: taskName,
              description,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.task).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.task.id).not.toBeNull();
          expect(result.task.name).toEqual(taskName);
          expect(result.task.description).toEqual(description);
          expect(result.task.status).toEqual('new');
          expect(new Date() - new Date(result.task.createdAt)).toBeLessThan(1000);
          expect(result.task.updatedAt).toBeUndefined();

          response = await fetch(`${baseUrl}/${result.task.id}`);

          expect(response.status).toEqual(200);

          const result2 = await response.json();

          expect(result2.task).not.toBeNull();
          expect(result2.success).toEqual(true);
          expect(result2.task.id).toEqual(result.task.id);
          expect(result2.task.name).toEqual(taskName);
          expect(result2.task.description).toEqual(description);
          expect(result2.task.status).toEqual('new');
          expect(result2.task.createdAt).toEqual(result.task.createdAt);
          expect(result2.task.updatedAt).toBeUndefined();
        });
      });
    });
  });

  describe('create & update', () => {
    describe('should create & update a task', () => {
      const data = [
        {
          name: 'only status update',
          taskName: 'Task 1',
          description: 'Task 1 description',
          newStatus: 'active',
        },
        {
          name: 'english full update',
          taskName: 'Task 1',
          description: 'Task 1 description',
          newTaskName: 'Task 1 New',
          newDescription: 'Task 1 New description',
          newStatus: 'active',
        },
        {
          name: 'english only name update',
          taskName: 'Task 1',
          description: 'Task 1 description',
          newTaskName: 'Task 1 New',
        },
        {
          name: 'english only description update',
          taskName: 'Task 1',
          description: 'Task 1 description',
          newDescription: 'Task 1 New description',
        },
        {
          name: 'japanese full update',
          taskName: 'タスク 1',
          description: 'タスク 1 説明',
          newTaskName: 'タスク 1 新',
          newDescription: 'タスク 1 新 説明',
          newStatus: 'active',
        },
        {
          name: 'japanese only name update',
          taskName: 'タスク 1',
          description: 'タスク 1 説明',
          newTaskName: 'タスク 1 新',
        },
        {
          name: 'japanese only description update',
          taskName: 'タスク 1',
          description: 'タスク 1 説明',
          newDescription: 'タスク 1 新 説明',
        },
        {
          name: 'japanese only status update',
          taskName: 'タスク 1',
          description: 'タスク 1 説明',
          newStatus: 'active',
        },
        {
          name: 'chinese full update',
          taskName: '任务 1',
          description: '任务 1 描述',
          newTaskName: '任务 1 新',
          newDescription: '任务 1 新 描述',
          newStatus: 'active',
        },
        {
          name: 'chinese only name update',
          taskName: '任务 1',
          description: '任务 1 描述',
          newTaskName: '任务 1 新',
        },
        {
          name: 'chinese only description update',
          taskName: '任务 1',
          description: '任务 1 描述',
          newDescription: '任务 1 新 描述',
        },
        {
          name: 'chinese only status update',
          taskName: '任务 1',
          description: '任务 1 描述',
          newStatus: 'active',
        },
        {
          name: 'emoji full update',
          taskName: '👍',
          description: '👍',
          newTaskName: '👍 👍',
          newDescription: '👍 👍 👍',
          newStatus: 'active',
        },
        {
          name: 'emoji only name update',
          taskName: '👍',
          description: '👍',
          newTaskName: '👍 👍',
        },
        {
          name: 'emoji only description update',
          taskName: '👍',
          description: '👍',
          newDescription: '👍 👍',
        },
        {
          name: 'emoji only status update',
          taskName: '👍',
          description: '👍',
          newStatus: 'active',
        },
      ];

      data.forEach(({
        name, taskName, description, newTaskName, newDescription, newStatus,
      }) => {
        it(name, async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: taskName,
              description,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.task).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.task.id).not.toBeNull();
          expect(result.task.name).toEqual(taskName);
          expect(result.task.description).toEqual(description);
          expect(result.task.status).toEqual('new');
          expect(new Date() - new Date(result.task.createdAt)).toBeLessThan(1000);
          expect(result.task.updatedAt).toBeUndefined();

          response = await fetch(`${baseUrl}/${result.task.id}`, {
            method: 'post',
            body: JSON.stringify({
              name: newTaskName,
              description: newDescription,
              status: newStatus,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(200);

          const result2 = await response.json();

          expect(result2.task).not.toBeNull();
          expect(result2.success).toEqual(true);
          expect(result2.task.id).toEqual(result.task.id);
          expect(result2.task.name).toEqual(newTaskName ?? taskName);
          expect(result2.task.description).toEqual(newDescription ?? description);
          expect(result2.task.status).toEqual(newStatus ?? 'new');
          expect(result2.task.createdAt).toEqual(result.task.createdAt);
          expect(new Date() - new Date(result2.task.updatedAt)).toBeLessThan(1000);
        });
      });
    });

    describe('correct statuses update', () => {
      const data = [
        {
          name: 'new-active',
          updates: ['active'],
        },
        {
          name: 'new-cancelled',
          updates: ['cancelled'],
        },
        {
          name: 'new-active-completed',
          updates: ['active', 'completed'],
        },
        {
          name: 'new-active-cancelled',
          updates: ['active', 'cancelled'],
        },
      ];

      data.forEach(({ name, updates }) => {
        it(name, async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: faker.lorem.word(),
              description: faker.lorem.sentence(),
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.task).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.task.id).not.toBeNull();

          for (let i = 0; i < updates.length; i += 1) {
            const update = updates[i];

            // eslint-disable-next-line no-await-in-loop
            response = await fetch(`${baseUrl}/${result.task.id}`, {
              method: 'post',
              body: JSON.stringify({
                status: update,
              }),
              headers: { 'Content-Type': 'application/json' },
            });

            expect(response.status).toEqual(200);

            // eslint-disable-next-line no-await-in-loop
            const result2 = await response.json();

            expect(result2.task).not.toBeNull();
            expect(result2.success).toEqual(true);
            expect(result2.task.id).toEqual(result.task.id);
            expect(result2.task.name).toEqual(result.task.name);
            expect(result2.task.description).toEqual(result.task.description);
            expect(result2.task.status).toEqual(update);
            expect(result2.task.createdAt).toEqual(result.task.createdAt);
            expect(new Date() - new Date(result2.task.updatedAt)).toBeLessThan(1000);
          }
        });
      });
    });

    describe('wrong statuses update', () => {
      const data = [
        {
          name: 'new-completed',
          updates: ['completed'],
        },
        {
          name: 'new-new',
          updates: ['new'],
        },
        {
          name: 'new-active-new',
          updates: ['active', 'new'],
        },
        {
          name: 'new-active-active',
          updates: ['active', 'active'],
        },
        {
          name: 'new-active-completed-new',
          updates: ['active', 'completed', 'new'],
        },
        {
          name: 'new-active-cancelled-active',
          updates: ['active', 'cancelled', 'active'],
        },
        {
          name: 'new-active-completed-cancelled',
          updates: ['active', 'completed', 'cancelled'],
        },
      ];

      data.forEach(({ name, updates }) => {
        it(name, async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: faker.lorem.word(),
              description: faker.lorem.sentence(),
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.task).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.task.id).not.toBeNull();

          for (let i = 0; i < updates.length - 1; i += 1) {
            const update = updates[i];

            // eslint-disable-next-line no-await-in-loop
            response = await fetch(`${baseUrl}/${result.task.id}`, {
              method: 'post',
              body: JSON.stringify({
                status: update,
              }),
              headers: { 'Content-Type': 'application/json' },
            });

            expect(response.status).toEqual(200);

            // eslint-disable-next-line no-await-in-loop
            const result2 = await response.json();

            expect(result2.task).not.toBeNull();
            expect(result2.success).toEqual(true);
            expect(result2.task.id).toEqual(result.task.id);
            expect(result2.task.name).toEqual(result.task.name);
            expect(result2.task.description).toEqual(result.task.description);
            expect(result2.task.status).toEqual(update);
            expect(result2.task.createdAt).toEqual(result.task.createdAt);
            expect(new Date() - new Date(result2.task.updatedAt)).toBeLessThan(1000);
          }

          const update = updates[updates.length - 1];
          const prevStatus = updates.length - 2 >= 0 ? updates[updates.length - 2] : 'new';

          response = await fetch(`${baseUrl}/${result.task.id}`, {
            method: 'post',
            body: JSON.stringify({
              status: update,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(400);

          const result3 = await response.json();

          expect(result3.task).toBeUndefined();
          expect(result3.success).toEqual(false);
          expect(result3.message).toEqual(`cannot update from '${prevStatus}' to '${update}'`);
        });
      });
    });
  });
});
