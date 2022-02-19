const registerRouter = require("express").Router();

const { Usuario } = require("../models");
const { camposValidos } = require("../utils");

registerRouter.post("/", async (req, res, next) => {
  const { nombre, apellidos, nickname, email, password } = req.body;
  // TODO: Manejar errores desde MONGO
  // Se validan los campos antes de crear al usuario
  const [validos, error] = camposValidos(req.body);
  // Si hay algún campo no valido, se retornará un JSON con los campos inválidos
  if (!validos) return next(error);

  try {
    // La única validación que ejecuta mongoose es la de campos únicos (nick, email)
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
    return next(error);
  }
});

module.exports = registerRouter;
