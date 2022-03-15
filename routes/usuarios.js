const usuariosRouter = require("express").Router();

const { userController } = require("../controllers");

const {
  jwtAuth,
  userAuthorized,
  userExists,
  articleExists,
  uploadMiddleware,
} = require("../middlewares");

const uploadAvatar = uploadMiddleware("avatar");

/* GET */
usuariosRouter.get("/:paramToSearch", userExists, userController.getUsuario);

/* PATCH */
usuariosRouter.patch(
  "/:id",
  jwtAuth,
  userExists,
  userAuthorized,
  uploadAvatar,
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
