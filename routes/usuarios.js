const usuariosRouter = require("express").Router();
const { Usuario } = require("../models");

/* GET users listing. */
usuariosRouter.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

usuariosRouter.post("/", async (req, res, next) => {
  const { nombre, apellidos, nickname, email, password } = req.body;

  try {
    const nuevoUsuario = new Usuario({
      nombre,
      apellidos,
      nickname,
      email,
      password: await Usuario.hashPassword(password),
    });
    await nuevoUsuario.save();
    return res.status(201).json({
      created: "ok",
      status: 201,
    });
  } catch (error) {
    const clavesError = Object.keys(error.errors);
    const errores = {};
    clavesError.forEach((clave) => {
      errores[clave] = {
        message: error.errors[clave].message,
      };
      const isUniqueError = errores[clave].message
        .split(" ", 6)
        .includes("unique.");
      if (isUniqueError) {
        errores[clave].message = `El campo ${clave} debe ser único`;
      }
    });
    return res.status(400).json(errores);
    // return res.status(400).json(error);
  }
});

module.exports = usuariosRouter;
