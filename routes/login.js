const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");

const { Usuario } = require("../models");

loginRouter.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  // Busca el usuario en la BD
  const usuario = await Usuario.findOne({ email })
  
  // Si no existe el usuario o no coincide la contraseña devuelve error
  if (!usuario || !(await usuario.comparePassword(password))) {
    const error = {
      status: 401,
      name: "LoginValidationError",
      message: "El usuario o contraseña no son correctos",
    };
    return next(error);
  }

  const usuarioToken = {
    _id: usuario._id,
    nickname: usuario.nickname,
  };

  // Si el usuario existe, valida contraseña y crea un JWT con el _id y el nickname del usuario
  const token = jwt.sign(usuarioToken, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return res.json({ token });
});

module.exports = loginRouter;
