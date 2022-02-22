const articulosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

/* GET */
articulosRouter.get("/", articulosController.getArticulos);

articulosRouter.get("/:id", articulosController.getArticulo);

/* PATCH */
articulosRouter.patch("/:id", jwtAuth, articulosController.actualizarArticulo);

/* DELETE */
articulosRouter.delete("/:id", jwtAuth, articulosController.borraArticulo);

/* POST */
articulosRouter.post("/", jwtAuth, articulosController.creaArticulo);

module.exports = articulosRouter;
