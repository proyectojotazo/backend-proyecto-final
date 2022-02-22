const usuariosRouter = require("express").Router();
const { jwtAuth } = require("../middlewares");

const { userController } = require("../controllers");

// TODO: Obtener todos los usuarios?

// GET
usuariosRouter.get("/:id", userController.getUsuario);

// PATCH
usuariosRouter.patch("/:id", jwtAuth, userController.updateUsuario);

// DELETE
usuariosRouter.delete("/:id", jwtAuth, userController.borrarUsuario);

module.exports = usuariosRouter;
