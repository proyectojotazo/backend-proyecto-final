const comentariosRouter = require("express").Router();

const { comentariosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

// GET comentario TODO 
comentariosRouter.get("/:id", jwtAuth, comentariosController.getComentarios)

// POST CREAR comentario TODO 
comentariosRouter.post("/:id", jwtAuth, comentariosController.creaComentario)

// POST RESPONDER comentario TODO 
comentariosRouter.post("/response/:id", jwtAuth, comentariosController.responderComentario)

module.exports = comentariosRouter;