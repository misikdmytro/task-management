const axios = require('axios');
const { setupServer } = require('./server');
const config = require('../common/config');

setupServer();

describe('Task', () => {
  describe('create', () => {
    const url = `http://${config.host}:${config.port}/v1/tasks`;

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
        const result = await axios.put(url, { name: item.taskName, description: item.description });

        expect(result.data.task).not.toBeNull();

        expect(result.data.task.id).not.toBeNull();
        expect(result.data.task.name).toEqual(item.taskName);
        expect(result.data.task.description).toEqual(item.description);
        expect(result.data.task.status).toEqual('new');
        expect(new Date() - new Date(result.data.task.createdAt)).toBeLessThan(1000);
        expect(result.data.task.updatedAt).toBeUndefined();
      });
    });
  });
});
