const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const docs = require('./routes/docs');
const health = require('./routes/health');
const v1 = require('./routes/v1');
const { errorHandler } = require('./middlewares/error');
const tracker = require('./middlewares/tracker');

const app = express();

app.use(express.json());

// tracker
app.use(tracker);

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// compress all responses
app.use(compression());

// docs
app.use('/docs', docs);

// health API
app.use('/health', health);

// V1 API
app.use('/v1', v1);

// error handler
app.use(errorHandler);

module.exports = app;
