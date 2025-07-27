const dotenv = require('dotenv');
dotenv.config();

const config = {
  APP_URL: process.env.APP_URL,
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  MODE: process.env.NODE_ENV
}

module.exports = config;
