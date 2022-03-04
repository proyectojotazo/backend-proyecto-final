const { Usuario } = require("../models");

const usuariosMencionados = async (contenido) => {
  const nicksArroba = contenido.split(" ").filter((e) => e[0] === "@");

  if (nicksArroba.length === 0) {
    return null;
  }

  const nicks = nicksArroba.map((e) => e.substr(1));

  return await Usuario.find({ nickname: { $in: nicks } }).select([
    "email",
    "nickname",
    "online",
  ]);
};

module.exports = usuariosMencionados;
