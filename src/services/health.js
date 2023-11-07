const mongoose = require('mongoose');

function healthcheck() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  healthcheck,
};
