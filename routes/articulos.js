const articulosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

/* GET */
articulosRouter.get("/", articulosController.getArticulos);

articulosRouter.get("/:idArticulo/comentario/:id", jwtAuth, articulosController.getComentarios)

articulosRouter.get("/:id", articulosController.getArticulo);

/* PATCH */
articulosRouter.patch("/:id", jwtAuth, articulosController.actualizarArticulo);

/* DELETE */
articulosRouter.delete("/:id", jwtAuth, articulosController.borraArticulo);

/* POST */
articulosRouter.post("/:id/comentario", jwtAuth, articulosController.creaComentario)

articulosRouter.post("/:idArticulo/comentario/:id", jwtAuth, articulosController.responderComentario)

articulosRouter.post("/", jwtAuth, articulosController.creaArticulo);

module.exports = articulosRouter;
