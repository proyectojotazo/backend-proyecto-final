const usuariosRouter = require("express").Router();
const { jwtAuth } = require("../middlewares");

const { userController } = require("../controllers");

usuariosRouter.post("/register", userController.registrar);

usuariosRouter.post("/login", userController.login);

usuariosRouter.delete("/:id", jwtAuth, userController.borrarUsuario);

module.exports = usuariosRouter;
