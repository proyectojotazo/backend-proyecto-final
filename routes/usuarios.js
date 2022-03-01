const usuariosRouter = require("express").Router();
const {
  jwtAuth,
  userAuthorized,
  userExists,
  articleExists,
} = require("../middlewares");
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
usuariosRouter.post(
  "/follow/:id",
  jwtAuth,
  userExists,
  userController.followUsuario
);

usuariosRouter.post(
  "/articles/favourites/:id",
  jwtAuth,
  articleExists,
  userController.articulosFavorito
);

module.exports = usuariosRouter;
