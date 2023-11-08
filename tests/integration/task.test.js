const axios = require('axios');
const { setupServer } = require('./server');
const config = require('../common/config');

setupServer();

describe('Task', () => {
  describe('create', () => {
    const url = `http://${config.host}:${config.port}/v1/tasks`;

    const data = [
      {
        name: 'english name',
        taskName: 'Task 1',
      },
      {
        name: 'japanese name',
        taskName: 'タスク 1',
      },
      {
        name: 'chinese name',
        taskName: '任务 1',
      },
      {
        name: 'emoji name',
        taskName: '👍',
      },
    ];

    data.forEach((item) => {
      it(`should create a task with ${item.name}`, async () => {
        const result = await axios.put(url, { name: item.taskName });

        expect(result.data.task).not.toBeNull();
        expect(result.data.task.name).toEqual(item.taskName);
        expect(result.data.task.id).not.toBeNull();
        expect(new Date() - new Date(result.data.task.createdAt)).toBeLessThan(1000);
      });
    });
  });
});
