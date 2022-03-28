const asyncHandler = require("express-async-handler");

const { Usuario } = require("../models");
const { getFollowData, getArticuloSeguidoData, urlConvert } = require("../utils");

const userController = {};

/* GET - Controllers */
userController.getUsuario = asyncHandler(async (req, res, next) => {
  const { paramToSearch } = req.params;

  // Si es ObjectId lo busca por Id si no, por nickname
  const usuario = await Usuario.findOnePopulated(paramToSearch);

  return res.status(302).json(usuario);
});

/* POST - Controllers */
userController.followUsuario = asyncHandler(async (req, res) => {
  const { paramToSearch: userIdDestino } = req.params;
  const userIdRemitente = req.userId;

  const sameUser = userIdDestino === userIdRemitente
  
  if (sameUser) return res.status(401).end()


  const usuarioDestino = await Usuario.findById(userIdDestino);
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
});

userController.articulosFavorito = asyncHandler(async (req, res, next) => {
  // obtenemos el id
  const { id } = req.params;
  // obtener id de usuario del token
  const usuarioId = req.userId;

  const usuario = await Usuario.findById(usuarioId);

  const articulofavorito = getArticuloSeguidoData(id, usuario);

  await usuario.actualizaUsuario(articulofavorito);

  return res.status(204).end();
});

/* PATCH - Controllers */
userController.updateUsuario = asyncHandler(async (req, res, next) => {
  // obtenemos id del usuario a actualizar
  const { paramToSearch } = req.params;

  // datos a actualizar
  const datosActualizar = {
    ...req.body,
    avatar: urlConvert(req.file?.path), // Si se envia avatar, se guarda el path
  };

  // buscamos al usuario
  const usuario = await Usuario.findById(paramToSearch);

  await usuario.actualizaUsuario(datosActualizar);

  return res.status(204).end();
});

/* DELETE - Controllers */
userController.borrarUsuario = asyncHandler(async (req, res, next) => {
  // obtendremos el id
  const { paramToSearch } = req.params;

  // buscamos al usuario
  const usuario = await Usuario.findById(paramToSearch);

  await Usuario.deleteAllData(usuario);

  return res.status(204).end();
});

module.exports = userController;
