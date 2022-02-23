const usuariosRouter = require('express').Router();
const { jwtAuth } = require('../middlewares');

const { userController } = require('../controllers');

// TODO: Obtener todos los usuarios?

// GET
usuariosRouter.get('/:id', userController.getUsuario);

// PATCH
usuariosRouter.patch('/:id', jwtAuth, userController.updateUsuario);

// DELETE
usuariosRouter.delete('/:id', jwtAuth, userController.borrarUsuario);

// FOLLOW USER
usuariosRouter.post('/follow/:user', jwtAuth, userController.followUsuario);

// UNFOLLOW USER
usuariosRouter.post('/unfollow/:user', jwtAuth, userController.unfollowUsuario);

// FAVORITO ARTICULO
usuariosRouter.post('/articlefavourite/:id', jwtAuth, userController.articulosfavorito);

module.exports = usuariosRouter;
