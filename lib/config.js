require("dotenv").config();

const {
  MONGODB_URI,
  MONGODB_URI_DEV,
  MONGODB_URI_TEST,
  PRODUCTION_PORT,
  DEVELOPMENT_PORT,
  TEST_PORT,
  NODE_ENV,
} = process.env;

const MONGO_CONNECTION = {
  production: MONGODB_URI,
  development: MONGODB_URI_DEV,
  test: MONGODB_URI_TEST,
};

const PORT_USED = {
  production: PRODUCTION_PORT,
  development: DEVELOPMENT_PORT,
  test: TEST_PORT,
};
console.log('hola')
const DB_URI = MONGO_CONNECTION[NODE_ENV]; 

const PORT = PORT_USED[NODE_ENV]

module.exports = {
  PORT,
  DB_URI,
};
