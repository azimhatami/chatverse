const dotenv = require('dotenv');
dotenv.config();

const config = {
  APP_URL: process.env.APP_URL,
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  MODE: process.env.NODE_ENV,
  ACCESS_TOKEN_SECRET_KEY : process.env.ACCESS_TOKEN_SECRET_KEY,
  COOKIE_PARSER_SECRET_KEY: process.env.COOKIE_PARSER_SECRET_KEY,
}

module.exports = config;
