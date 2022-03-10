const { registroManejoErrores } = require("../utils");

const { deleteFile } = require("../services/fileHandlerServices");

const ERRORS = {
  ValidationError: (err) => {
    return registroManejoErrores(err);
  },
  CastError: (err) => ({
    name: err.name,
    message: "Id used is malformed",
    status: 400,
  }),
  JsonWebTokenError: (err) => ({
    ...err,
    status: 401,
  }),
  defaultError: (err) => ({ ...err }),
};

const errorHandler = (err, req, res, next) => {
  // Si ocurre un error en endpoint con multer borramos ese archivo creado
  if (req.file) deleteFile(req.file.path);
  
  const handler = ERRORS[err.name] || ERRORS.defaultError;
  const error = handler(err);
  return res.status(error.status || 500).json(error);
};

module.exports = errorHandler;
