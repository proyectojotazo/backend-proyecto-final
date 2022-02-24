const usuariosRouter = require("express").Router();
const { jwtAuth, userAuthorized, userExists } = require("../middlewares");

const { userController } = require("../controllers");

/* GET */
usuariosRouter.get("/:id", userController.getUsuario);

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
usuariosRouter.post("/follow/:user", jwtAuth, userController.followUsuario);

usuariosRouter.post("/unfollow/:user", jwtAuth, userController.unfollowUsuario);

usuariosRouter.post(
  "/articles/favourites/:id",
  jwtAuth,
  userController.articulosfavorito
);

module.exports = usuariosRouter;
