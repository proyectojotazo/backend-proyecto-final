const registroManejoErrores = require("../utils/registroManejoErrores");

const errorHandler = (err, req, res, next) => {
  console.log(err.status);
  if (err.name === "ValidationError") {
    // Errores campos unicos Mongoose
    const erroresUnique = registroManejoErrores(err);
    return res.status(erroresUnique.status).json(erroresUnique);
  }
  return res.status(err.status || 500).json(err);
};

module.exports = errorHandler;
