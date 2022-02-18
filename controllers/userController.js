const jwt = require("jsonwebtoken");

const { Usuario, Articulo } = require("../models");

const { camposValidos, getUserFromJwt } = require("../utils");

const userController = {};

userController.registrar = async (req, res, next) => {
  const { nombre, apellidos, nickname, email, password } = req.body;

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
    console.log('errores =>', error)
    return next(error);
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Busca el usuario en la BD
  const usuario = await Usuario.findOne({ email });

  // Si no existe el usuario o no coincide la contraseña devuelve error
  if (!usuario || !(await usuario.comparePassword(password))) {
    const error = {
      status: 401,
      type: "LoginValidationError",
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
};

userController.borrarUsuario = async (req, res, next) => {
  // obtenermos el id
  const _id = req.params.id;

  // obtener id de usuario del token
  const tokenUser = req.get("Authorization");
  const userId = getUserFromJwt(tokenUser);

  try {
    // buscamos al usuario
    const usuario = await Usuario.find({ _id });
    if (usuario.length === 0) {
      // Si no encuentra al usuario
      const error = {
        name: "UserNotFound",
        status: 404,
        message: "Usuario Inexistente",
      };
      return next(error);
    }
    // comprueba si el id del usuario a borrar es el mismo que esta logueado
    if (userId !== _id) {
      const error = {
        name: "Unauthorized",
        status: 401,
        message: "No estas autorizado para borrar este usuario",
      };
      return next(error);
    }
    //  buscamos los articulos que ha creado el usuario
    const articulos = usuario[0].articulos.creados;

    // borramos todos esos articulos
    await Articulo.deleteMany({ _id: articulos });

    // borramos al usuario
    await Usuario.findByIdAndDelete({ _id });

    return res.status(201).json({
      deleted: "ok",
      status: 201,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = userController;
