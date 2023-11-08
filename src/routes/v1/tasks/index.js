const { Router } = require('express');
const taskController = require('../../../controllers/task');
const taskValidation = require('../../../validation/task');
const validate = require('../../../middlewares/validate');

const router = Router();

router.get('/:id', validate(taskValidation.getTaskById), taskController.getTaskById);
router.put('/', validate(taskValidation.createTask), taskController.createTask);
router.post('/:id', validate(taskValidation.updateTaskById), taskController.updateTaskById);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: Task management and retrieval
 * /v1/tasks/{id}:
 *  get:
 *   summary: Get a task by id
 *   tags: [Tasks]
 *   description: Get a task by id
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       required: true
 *       description: Task id
 *       example: 5f0a3d9a3e06e52f3c7a6d5c
 *   responses:
 *    200:
 *     description: Task Retrieved
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/TaskResult'
 *    404:
 *     description: Task not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/TaskResult'
 *    500:
 *     description: Internal Server Error
 *  post:
 *   summary: Update a task by id
 *   tags: [Tasks]
 *   description: Update a task by id
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       required: true
 *       description: Task id
 *       example: 5f0a3d9a3e06e52f3c7a6d5c
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UpdateTask'
 *   responses:
 *    200:
 *     description: Task Updated
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/TaskResult'
 *     404:
 *      description: Task not found
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/TaskResult'
 *     500:
 *      description: Internal Server Error
 * /v1/tasks:
 *  put:
 *   summary: Create a task
 *   tags: [Tasks]
 *   description: Create a task
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateTask'
 *   responses:
 *    201:
 *     description: Task Created
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/TaskResult'
 *    500:
 *     description: Internal Server Error
 */
