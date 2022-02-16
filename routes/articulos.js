const express = require("express");
const articulosRouter = express.Router();
const { Articulo } = require("../models");
const { jwtAuth } = require("../middlewares");

/* GET home page. */
articulosRouter.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});


articulosRouter.post("/", jwtAuth, async (req, res, next) => {
  const {
    titulo,
    archivoDestacado,
    textoIntroductorio,
    contenido,
    // fechaPublicacion,
    estado,
    categorias,
    usuario,
    comentarios } = req.body;


  try {
    const nuevoArticulo = new Articulo({
      titulo,
      archivoDestacado,
      textoIntroductorio,
      contenido,
      // fechaPublicacion: Date.now(),
      estado,
      categorias,
      usuario,
      comentarios
    });
    await nuevoArticulo.save();
    res.json({ msj: "articulo insertado de forma satifactoria", id: nuevoArticulo._id });
  } catch (error) {
    res.json(error)
  }
});




module.exports = articulosRouter;
