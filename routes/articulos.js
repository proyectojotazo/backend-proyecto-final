const articulosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const {
  jwtAuth,
  articleExists,
  validArticleId,
  uploadMiddleware,
} = require("../middlewares");

const uploadArchivoDestacado = uploadMiddleware("archivoDestacado");

/* GET */
articulosRouter.get("/", articulosController.getArticulos);

articulosRouter.get("/categories", articulosController.getCategorias);

articulosRouter.get(
  "/:id",
  validArticleId,
  articleExists,
  articulosController.getArticulo
);

/* PATCH */
articulosRouter.patch(
  "/:id",
  jwtAuth,
  articleExists,
  uploadArchivoDestacado,
  articulosController.actualizarArticulo
);

/* DELETE */
articulosRouter.delete(
  "/:id",
  jwtAuth,
  articleExists,
  articulosController.borraArticulo
);

/* POST */
articulosRouter.post(
  "/",
  jwtAuth,
  uploadArchivoDestacado,
  articulosController.creaArticulo
);

articulosRouter.post("/search", articulosController.buscarArticulos);

articulosRouter.post(
  "/response/:id",
  jwtAuth,
  articleExists,
  uploadArchivoDestacado,
  articulosController.respuestaArticulo
);

module.exports = articulosRouter;
