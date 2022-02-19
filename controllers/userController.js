const { Usuario, Articulo } = require("../models");
const { getUserFromJwt } = require("../utils");
const { camposValidos } = require("../utils");

const userController = {};

userController.getUsuario = async (req, res, next) => {
  const id = req.params.id;

  try {
    const usuario = await Usuario.findByIdPopulated(id);

    // Si no se encuentra el usuario
    if (!usuario) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Usuario no encontrado",
      };
      return next(error);
    }
    return res.status(302).json({ usuario });
  } catch (error) {
    return next(error);
  }
};

userController.patchUsuario = async (req, res, next) => {
  // obtenemos id del usuario a actualizar
  const id = req.params.id;

  // obtener id de usuario del token
  const tokenUser = req.get("Authorization");
  const userId = getUserFromJwt(tokenUser);

  // datos a actualizar
  const datosActualizar = req.body;

  try {
    // buscamos al usuario
    const usuario = await Usuario.find({ id });
    // Si no encuentra al usuario devuelve error
    if (usuario.length === 0) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Usuario no encontrado",
      };
      return next(error);
    }

    // comprueba si el id del usuario a actualizar es el mismo que esta logueado
    if (userId !== id) {
      const error = {
        name: "Unauthorized",
        status: 401,
        message: "No estas autorizado para actualizar este usuario",
      };
      return next(error);
    }

    const hayCamposVacios = Object.values(datosActualizar).some(
      (campo) => campo === ""
    );

    // Si dejamos algún campo a actualizar vacío
    if (hayCamposVacios) {
      const error = {
        name: "UpdateValidationError",
        status: 400,
        message: "Hay campos vacíos",
      };
      return next(error);
    }

    // Se validan los campos antes de actualizar usuario
    const [validos, error] = camposValidos(req.body);
    // Si hay algún campo no valido, se retornará un JSON con los campos inválidos
    if (!validos) return next(error);

    if (datosActualizar.password) {
      datosActualizar.password = await Usuario.hashPassword(
        datosActualizar.password
      );
    }

    await Usuario.findByIdAndUpdate(id, datosActualizar);
    return res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    return next(error);
  }
};

userController.borrarUsuario = async (req, res, next) => {
  // obtendremos el id
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
        name: "NotFound",
        status: 404,
        message: "Usuario no encontrado",
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
