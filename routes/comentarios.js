const comentariosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

// GET comentario TODO ¿mover a otro lado para que quede más limpio?
comentariosRouter.get("/:id", jwtAuth, articulosController.getComentarios)

// POST CREAR comentario TODO ¿mover a otro lado para que quede más limpio?
comentariosRouter.post("/:id", jwtAuth, articulosController.creaComentario)
// POST RESPONDER comentario TODO ¿mover a otro lado para que quede más limpio?
comentariosRouter.post("/response/:id", jwtAuth, articulosController.responderComentario)

module.exports = comentariosRouter;