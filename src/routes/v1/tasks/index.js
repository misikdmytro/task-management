const { Router } = require('express');
const taskController = require('../../../controllers/task');
const taskValidation = require('../../../validation/task');
const validate = require('../../../middlewares/validate');

const router = Router();

router.put('/', validate(taskValidation.createTask), taskController.createTask);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: Task management and retrieval
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
 *    responses:
 *     201:
 *      description: Task Created
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Task'
 *      500:
 *       description: Internal Server Error
 */
