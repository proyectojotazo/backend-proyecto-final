const usuariosRouter = require("express").Router();
const { jwtAuth } = require("../middlewares");

const { userController } = require("../controllers");

// TODO: Obtener todos los usuarios?

usuariosRouter.get("/:id", userController.getUsuario);

usuariosRouter.patch("/:id", jwtAuth, userController.updateUsuario);

usuariosRouter.delete("/:id", jwtAuth, userController.borrarUsuario);

module.exports = usuariosRouter;
