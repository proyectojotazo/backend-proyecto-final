const { Usuario } = require("../models");

const userExists = async (req, res, next) => {
  const { id, nickname } = req.params;

  const usuario = nickname
    ? await Usuario.findOne({ nickname })
    : await Usuario.findById(id);

  // Si no encuentra al usuario devuelve error
  if (!usuario) {
    const error = {
      name: "NotFound",
      status: 404,
      message: "Usuario no encontrado",
    };
    return next(error);
  }

  next();
};

module.exports = userExists;
