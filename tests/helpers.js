const { Usuario } = require("../models");

const testUser = {
  nombre: "Test",
  apellidos: "apellidosTest",
  email: "email@gmail.com",
  nickname: "nicknameTest",
  password: "1234Abcd-",
  articulos: { creados: [], favoritos: [] },
  usuarios: { seguidos: [], seguidores: [] },
};

const ERRORS = {
  CastError: "CastError",
  NotFound: "NotFound",
};

const getUserId = async () => {
  const user = await Usuario.findOne({ nombre: testUser.nombre });
  return user._id;
};

module.exports = { testUser, ERRORS, getUserId };
