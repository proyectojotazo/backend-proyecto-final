const jwt = require('jsonwebtoken');

const { Usuario, Articulo } = require('../models');

const { camposValidos, registroManejoErrores } = require('../utils');

const userController = {};

userController.registrar = async (req, res, next) => {
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
      created: 'ok',
      status: 201,
    });
  } catch (error) {
    // Manejamos y limpiamos los errores que llegan
    const errores = registroManejoErrores(error);
    return res.status(400).json(errores);
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Busca el usuario en la BD
  const usuario = await Usuario.findOne({ email });

  // Si no existe el usuario o no coincide la contraseña devuelve error
  if (!usuario || !(await usuario.comparePassword(password))) {
    return res
      .status(400)
      .json({ message: 'El usuario o contraseña no son correctos' });
  }

  // Si el usuario existe, valida contraseña y crea un JWT con el _id del usuario
  jwt.sign(
    { _id: usuario._id },
    process.env.JWT_SECRET,
    {
      expiresIn: '15d',
    },
    (error, jwtToken) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // Devuelve el token generado
      res.json({ token: jwtToken });
    }
  );

};

userController.borrarUsuario = async (req, res, next) => {
  try {
    // obtenermos el id
    const _id = req.params.id;
    // buscamos al usuario
    const usuario = await Usuario.find({ _id});
    //  buscamos los articulos que ha creado el usuario
    const articulos = usuario[0].articulos.creados
    // borramos todos esos articulos
    if (articulos.length>0) {
      await Articulo.deleteMany({ _id: articulos }) } 
    // borramos al usuario
    await Usuario.findByIdAndDelete({_id})
    return res.status(201).json({
      deleted: 'ok',
      status: 201,
    });
  } catch (error) {
    res.status(500).json(error);
  }
  
};



module.exports = userController;
