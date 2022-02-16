const usuariosRouter = require("express").Router();

const { Usuario } = require("../models");

const { camposValidos, registroManejoErrores } = require("../utils");

usuariosRouter.post("/", async (req, res, next) => {
  const { nombre, apellidos, nickname, email, password } = req.body;

  // Se validan los campos antes de crear al usuario
  const [validos, err] = camposValidos(req.body);
  // Si hay algún campo no valido, se retornará un JSON con los campos inválidos
  if (!validos) return res.status(400).json(err);

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
    // Manejamos y limpiamos los errores que llegan
    const errores = registroManejoErrores(error);
    return res.status(400).json(errores);
  }
});

module.exports = usuariosRouter;
