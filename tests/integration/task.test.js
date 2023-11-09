const { faker } = require('@faker-js/faker');
const fetch = require('node-fetch');
const { setupServer } = require('./server');

setupServer();

describe('Task', () => {
  const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/v1/tasks`;

  describe('get', () => {
    it('should return 404', async () => {
      const response = await fetch(`${baseUrl}/${faker.database.mongodbObjectId()}`);
      expect(response.status).toEqual(404);

      const result = await response.json();
      expect(result).toEqual({ success: false, message: 'task not found' });
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
          expect(result).toEqual({
            success: false,
            message: `"id" with value "${id}" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`,
          });
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

          expect(result).toEqual({
            success: true,
            task: {
              id: expect.any(String),
              name: taskName,
              description,
              status: 'new',
              createdAt: expect.any(String),
            },
          });

          expect(new Date() - new Date(result.task.createdAt)).toBeLessThan(1000);

          response = await fetch(`${baseUrl}/${result.task.id}`);

          expect(response.status).toEqual(200);

          const result2 = await response.json();

          expect(result2).toEqual({
            success: true,
            task: {
              id: result.task.id,
              name: taskName,
              description,
              status: 'new',
              createdAt: result.task.createdAt,
            },
          });
        });
      });
    });
  });

  describe('create & update', () => {
    describe('update', () => {
      it('should return 404', async () => {
        const response = await fetch(`${baseUrl}/${faker.database.mongodbObjectId()}`, {
          method: 'post',
          body: JSON.stringify({
            name: faker.lorem.word(),
            description: faker.lorem.sentence(),
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        expect(response.status).toEqual(404);

        const result = await response.json();

        expect(result).toEqual({ success: false, message: 'task not found' });
      });

      describe('should return 400', () => {
        it('no updates', async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: 'Task 1',
              description: 'Task 1 description',
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.success).toEqual(true);
          expect(result.task).not.toBeNull();
          expect(result.task.id).not.toBeNull();

          response = await fetch(`${baseUrl}/${result.task.id}`, {
            method: 'post',
            body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(400);

          const result2 = await response.json();

          expect(result2).toEqual({
            success: false,
            message: 'at least one update required',
          });
        });

        it('invalid status', async () => {
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: 'Task 1',
              description: 'Task 1 description',
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          const result = await response.json();

          expect(result.task).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.task.id).not.toBeNull();

          response = await fetch(`${baseUrl}/${result.task.id}`, {
            method: 'post',
            body: JSON.stringify({ status: 'invalid' }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(400);

          const result2 = await response.json();

          expect(result2).toEqual({
            success: false,
            message: '"status" must be one of [new, active, completed, cancelled]',
          });
        });
      });
    });

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

          expect(result2).toEqual({
            success: true,
            task: {
              id: result.task.id,
              name: newTaskName ?? taskName,
              description: newDescription ?? description,
              status: newStatus ?? 'new',
              createdAt: result.task.createdAt,
              updatedAt: expect.any(String),
            },
          });

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

            expect(result2).toEqual({
              success: true,
              task: {
                id: result.task.id,
                name: result.task.name,
                description: result.task.description,
                status: update,
                createdAt: result.task.createdAt,
                updatedAt: expect.any(String),
              },
            });

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

            expect(result2.success).toEqual(true);
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

          expect(result3).toEqual({
            success: false,
            message: `cannot update from '${prevStatus}' to '${update}'`,
          });
        });
      });
    });

    describe('concurrent updates', () => {
      it('one should 200, another 400', async () => {
        for (let i = 0; i < 20; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          let response = await fetch(baseUrl, {
            method: 'put',
            body: JSON.stringify({
              name: faker.lorem.word(),
              description: faker.lorem.sentence(),
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(201);

          // eslint-disable-next-line no-await-in-loop
          const result = await response.json();

          expect(result.task).not.toBeNull();
          expect(result.success).toEqual(true);
          expect(result.task.id).not.toBeNull();

          // eslint-disable-next-line no-await-in-loop
          response = await fetch(`${baseUrl}/${result.task.id}`, {
            method: 'post',
            body: JSON.stringify({
              status: 'active',
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          expect(response.status).toEqual(200);

          const promise1 = fetch(`${baseUrl}/${result.task.id}`, {
            method: 'post',
            body: JSON.stringify({
              status: 'completed',
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const promise2 = fetch(`${baseUrl}/${result.task.id}`, {
            method: 'post',
            body: JSON.stringify({
              status: 'cancelled',
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          // eslint-disable-next-line no-await-in-loop
          const [response1, response2] = await Promise.all([promise1, promise2]);

          if (response1.status === 200) {
            expect(response1.status).toEqual(200);
            expect(response2.status).toEqual(400);
          } else {
            expect(response2.status).toEqual(200);
            expect(response1.status).toEqual(400);
          }
        }
      });
    });
  });
});
