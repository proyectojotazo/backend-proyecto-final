const { registroManejoErrores } = require("../utils");

const errorHandler = (err, req, res, next) => {
  console.log('err =>', err);
  if (err.name === "ValidationError") {
    // Errores campos unicos Mongoose
    const erroresUnique = registroManejoErrores(err);
    return res.status(erroresUnique.status).json(erroresUnique);
  }
  return res.status(err.status || 500).json(err);
};

module.exports = errorHandler;
