require("dotenv").config();

const {
  MONGODB_URI,
  MONGODB_URI_TEST,
  PORT: DEF_PORT,
  TEST_PORT,
  NODE_ENV,
} = process.env;

const DB_URI = NODE_ENV === "test" ? MONGODB_URI_TEST : MONGODB_URI;

const PORT = NODE_ENV === "test" ? TEST_PORT : DEF_PORT;

module.exports = {
  PORT,
  DB_URI,
};
