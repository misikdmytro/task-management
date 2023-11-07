const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../configs/tests.env') });

module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
  mongo: {
    url: process.env.MONGODB_URL,
  },
};
