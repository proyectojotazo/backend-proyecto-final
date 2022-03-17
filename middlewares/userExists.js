const { Usuario } = require("../models");

const { isObjectId } = require('../utils')

const userExists = async (req, res, next) => {
  const { paramToSearch } = req.params;

  const usuario = isObjectId(paramToSearch)
    ? await Usuario.findById(paramToSearch)
    : await Usuario.findOne({ nickname: paramToSearch })
     
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
