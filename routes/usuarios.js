const usuariosRouter = require("express").Router();
const { jwtAuth, userAuthorized, userExists } = require("../middlewares");

const { userController } = require("../controllers");

/* GET */
usuariosRouter.get("/:nickname", userController.getUsuario);

/* PATCH */
usuariosRouter.patch(
  "/:id",
  jwtAuth,
  userExists,
  userAuthorized,
  userController.updateUsuario
);

/* DELETE */
usuariosRouter.delete(
  "/:id",
  jwtAuth,
  userExists,
  userAuthorized,
  userController.borrarUsuario
);

/* POST */
usuariosRouter.post("/follow/:id", userExists, jwtAuth, userController.followUsuario);

usuariosRouter.post(
  "/articles/favourites/:id",
  jwtAuth,
  userController.articulosfavorito
);

module.exports = usuariosRouter;
