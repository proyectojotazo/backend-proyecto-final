const { registroManejoErrores } = require("../utils");

const ERRORS = {
  ValidationError: (err) => {
    return registroManejoErrores(err);
  },
  CastError: (err) => ({
    name: err.name,
    message: "Id used is malformed",
    status: 400,
  }),
  defaultError: (err) => ({ ...err }),
};

const errorHandler = (err, req, res, next) => {
  const handler = ERRORS[err.name] || ERRORS.defaultError;
  const error = handler(err);
  return res.status(error.status || 500).json(error);
};

module.exports = errorHandler;
