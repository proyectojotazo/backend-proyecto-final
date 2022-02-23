const usuariosRouter = require("express").Router();
const { jwtAuth } = require("../middlewares");

const { userController } = require("../controllers");

/* GET */
usuariosRouter.get("/:id", userController.getUsuario);

/* PATCH */
usuariosRouter.patch("/:id", jwtAuth, userController.updateUsuario);

/* DELETE */
usuariosRouter.delete("/:id", jwtAuth, userController.borrarUsuario);

/* POST */
usuariosRouter.post("/follow/:user", jwtAuth, userController.followUsuario);

usuariosRouter.post("/unfollow/:user", jwtAuth, userController.unfollowUsuario);

usuariosRouter.post(
  "/articles/favourites/:id",
  jwtAuth,
  userController.articulosfavorito
);

module.exports = usuariosRouter;
