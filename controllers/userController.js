const { Usuario } = require("../models");

const {
  getUserFromJwt,
  getFollowData,
  getArticuloSeguidoData,
} = require("../utils");

const { deleteFolderUser } = require("../utils/deleteFiles");

const userController = {};

userController.getUsuario = async (req, res, next) => {
  const { nickname } = req.params;

  try {
    const usuario = await Usuario.findOnePopulated(nickname);

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

userController.updateUsuario = async (req, res, next) => {
  // obtenemos id del usuario a actualizar
  const { id } = req.params;

  // datos a actualizar
  const datosActualizar = req.body;

  try {
    // buscamos al usuario
    const usuario = await Usuario.findById(id);

    await usuario.actualizaUsuario(datosActualizar);

    // Al no enviar información simplemente enviaremos .end()
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

userController.borrarUsuario = async (req, res, next) => {
  // obtendremos el id
  const { id } = req.params;

  try {
    // buscamos al usuario
    const usuario = await Usuario.findById(id);

    await Usuario.deleteAllData(usuario);

    deleteFolderUser(id);

    // Al no enviar información simplemente enviaremos .end()
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

userController.followUsuario = async (req, res, next) => {
  const { id: userIdDestino } = req.params;

  try {
    const usuarioDestino = await Usuario.findById(userIdDestino);
    const tokenUser = req.get("Authorization").split(" ")[1];
    const userIdRemitente = getUserFromJwt(tokenUser);

    const usuarioRemitente = await Usuario.findById(userIdRemitente);

    const { dataToRemitente, dataToDestino } = getFollowData(
      usuarioDestino,
      usuarioRemitente
    );

    // Actualizamos el usuario remitente y añadimos que sigue a esa persona
    await usuarioRemitente.actualizaUsuario(dataToRemitente);

    // Actualizamos el usuario destino y le añadimos el seguidor que le sigue
    await usuarioDestino.actualizaUsuario(dataToDestino);

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

userController.articulosFavorito = async (req, res, next) => {
  try {
    // obtenemos el id
    const { id } = req.params;

    // obtener id de usuario del token
    const tokenUser = req.get("Authorization").split(" ")[1];
    const usuario = await Usuario.findOne({ _id: getUserFromJwt(tokenUser) });

    const articulofavorito = getArticuloSeguidoData(id, usuario);

    await usuario.actualizaUsuario(articulofavorito);

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

module.exports = userController;
