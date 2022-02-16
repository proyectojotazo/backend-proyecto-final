"use strict";

const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

class LoginController {
  index(req, res, next) {
    res.locals.error = "";
    res.render("login");
  }

  // POST /login
  async post(req, res, next) {
    try {
      const { email, password } = req.body;

      // Busca el usuario en la BD
      const usuario = await Usuario.findOne({ email });

      // Si no existe el usuario o no coincide la contraseña devuelve error
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.json({ message: "El usuario o contraseña no son correctos" });
        return;
      }

      // Si el usuario existe, valida contraseña y crea un JWT con el _id del usuario
      jwt.sign(
        { _id: usuario._id },
        process.env.SECRET_KEY,
        {
          expiresIn: "15d",
        },
        (error, jwtToken) => {
          if (error) {
            next(error);
            return;
          }
          // Devuelve el token generado
          res.json({ token: jwtToken });
        }
      );
    } catch (error) {
      next();
    }
  }
}

module.exports = LoginController;
