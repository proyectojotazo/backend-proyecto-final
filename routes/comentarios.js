const comentariosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

// GET comentario TODO 
comentariosRouter.get("/:id", jwtAuth, articulosController.getComentarios)

// POST CREAR comentario TODO 
comentariosRouter.post("/:id", jwtAuth, articulosController.creaComentario)
// POST RESPONDER comentario TODO 
comentariosRouter.post("/response/:id", jwtAuth, articulosController.responderComentario)

module.exports = comentariosRouter;