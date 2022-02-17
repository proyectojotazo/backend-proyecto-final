const usuariosRouter = require("express").Router();

const { userController } = require("../controllers");

usuariosRouter.post("/register", userController.registrar);

usuariosRouter.post("/login", userController.login);

module.exports = usuariosRouter;
