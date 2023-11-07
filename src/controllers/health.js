const { healthcheck } = require('../services/health');

function health(req, res) {
  const status = healthcheck() ? 200 : 500;
  res.status(status).send();
}

module.exports = {
  health,
};
