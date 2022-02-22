/* eslint-disable no-console */
const config = require("./config");
const mongoose = require("mongoose");

// Connection to MONGODB

mongoose
  .connect(config.DB_URI)
  .then(() => {
    console.info(
      `Connected to MongoDB, in ${mongoose.connection.name} database`
    );
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err.message);
    process.exit(1);
  });
