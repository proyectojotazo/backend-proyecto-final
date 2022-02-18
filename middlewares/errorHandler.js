const { registroManejoErrores } = require("../utils");

const errorHandler = (err, req, res, next) => {
  console.log("err =>", err.name);
  let error = {};
  if (err.name === "ValidationError") {
    // Errores campos unicos Mongoose
    error = registroManejoErrores(err);
  } else if (err.name === "CastError") {
    error = {
      name: err.name,
      message: "Bad ID",
      status: 400,
    };
  } else {
    error = { ...err };
  }

  return res.status(error.status || 500).json(error);
};

module.exports = errorHandler;
