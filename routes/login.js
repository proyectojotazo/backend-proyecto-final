const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");

const { Usuario } = require("../models");

loginRouter.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  // Busca el usuario en la BD
  const usuario = await Usuario.findOne({ email }).select("password");
  // TODO: Dejamos select?

  // Si no existe el usuario o no coincide la contraseña devuelve error
  if (!usuario || !(await usuario.comparePassword(password))) {
    const error = {
      status: 401,
      name: "LoginValidationError",
      message: "El usuario o contraseña no son correctos",
    };
    return next(error);
  }

  // Si el usuario existe, valida contraseña y crea un JWT con el _id del usuario
  jwt.sign(
    { _id: usuario._id, nickname: usuario.nickname },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    },
    (error, jwtToken) => {
      if (error) {
        return next(error);
      }
      // Devuelve el token generado
      res.json({ token: jwtToken });
    }
  );
});

module.exports = loginRouter;
