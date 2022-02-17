const jwt = require("jsonwebtoken");

const { Usuario } = require("../models");

const { camposValidos } = require("../utils");

const userController = {};

userController.registrar = async (req, res, next) => {
  const { nombre, apellidos, nickname, email, password } = req.body;

  // Se validan los campos antes de crear al usuario
  const [validos, err] = camposValidos(req.body);
  // Si hay algún campo no valido, se retornará un JSON con los campos inválidos
  if (!validos) return next(err);

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
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Busca el usuario en la BD
  const usuario = await Usuario.findOne({ email });

  // Si no existe el usuario o no coincide la contraseña devuelve error
  if (!usuario || !(await usuario.comparePassword(password))) {
    const err = {
      status: 401,
      type: "LoginValidationError",
      message: "El usuario o contraseña no son correctos",
    };
    return next(err);
  }

  // Si el usuario existe, valida contraseña y crea un JWT con el _id del usuario
  jwt.sign(
    { _id: usuario._id },
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
};
module.exports = userController;
