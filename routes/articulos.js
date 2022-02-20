const articulosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

/* GET */
articulosRouter.get("/", articulosController.getArticulos);

// GET comentario TODO ¿mover a otro lado para que quede más limpio?
// articulosRouter.get("/:idArticulo/comment/:id", jwtAuth, articulosController.getComentarios)

articulosRouter.get("/:id", articulosController.getArticulo);

/* PATCH */
articulosRouter.patch("/:id", jwtAuth, articulosController.actualizarArticulo);

/* DELETE */
articulosRouter.delete("/:id", jwtAuth, articulosController.borraArticulo);

/* POST */
// POST CREAR comentario TODO ¿mover a otro lado para que quede más limpio?
// articulosRouter.post("/:id/comment", jwtAuth, articulosController.creaComentario)
// POST RESPONDER comentario TODO ¿mover a otro lado para que quede más limpio?
// articulosRouter.post("/:idArticulo/comment/:id", jwtAuth, articulosController.responderComentario)

articulosRouter.post("/", jwtAuth, articulosController.creaArticulo);

module.exports = articulosRouter;
