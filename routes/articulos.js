const articulosRouter = require("express").Router();
const { jwtAuth, articleExists } = require("../middlewares");
const upload = require("../lib/multerConfig");
const { articulosController } = require("../controllers");

/* GET */
articulosRouter.get("/", articulosController.getArticulos);

articulosRouter.get("/categories", articulosController.getCategorias);

articulosRouter.get("/:id",articleExists , articulosController.getArticulo);

/* PATCH */
articulosRouter.patch(
  "/:id",
  jwtAuth,
  articleExists,
  upload.single("archivoDestacado"),
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
  upload.single("archivoDestacado"),
  articulosController.creaArticulo
);

articulosRouter.post("/search", articulosController.buscarArticulos);

articulosRouter.post(
  "/response/:id",
  jwtAuth,
  articleExists,
  upload.single("archivoDestacado"),
  articulosController.respuestaArticulo
);

module.exports = articulosRouter;
