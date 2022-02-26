require("dotenv").config();

const {
  MONGODB_URI,
  MONGODB_URI_DEV,
  MONGODB_URI_TEST,
  PRODUCTION_PORT,
  DEV_PORT,
  TEST_PORT,
  NODE_ENV,
} = process.env;

const DB_URI = {
  production: MONGODB_URI,
  development: MONGODB_URI_DEV,
  test: MONGODB_URI_TEST,
};

const PORT = {
  production: PRODUCTION_PORT,
  development: DEV_PORT,
  test: TEST_PORT,
};

module.exports = {
  PORT: PORT[NODE_ENV],
  DB_URI: DB_URI[NODE_ENV],
};
