const { Router } = require('express');
const { health } = require('../../controllers/health');

const router = Router();

router.get('/', health);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Health
 *  description: Health check
 * /health:
 *  get:
 *   summary: Health check
 *   tags: [Health]
 *   description: Health check
 *   responses:
 *    200:
 *     description: Health check
 *    500:
 *     description: Internal Server Error
 */
