const express = require("express");
const articulosRouter = express.Router();
const { Articulo } = require("../models");
const { jwtAuth } = require("../middlewares");
const getUserFromJwt = require("../utils/getUserFromJwt");

/* GET */
articulosRouter.get("/", async (req, res, next) => {
  try {
    const articulo = await Articulo.find({});
    res.json({ articles: articulo });
  } catch (err) {
    next(err);
  }
});

articulosRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const articulo = await Articulo.find({ _id: id });
    res.json({ articulo });
  } catch (err) {
    next(err);
  }
});

/* POST */
articulosRouter.post("/", jwtAuth, async (req, res, next) => {
  const {
    titulo,
    archivoDestacado,
    textoIntroductorio,
    contenido,
    // fechaPublicacion,
    estado,
    categorias,
    comentarios,
  } = req.body;

  const jwtToken =
    req.get("Authorization") || req.query.token || req.body.token;

  const usuario = getUserFromJwt(jwtToken);

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
      comentarios,
    });
    await nuevoArticulo.save();
    res.json({
      msj: "articulo insertado de forma satifactoria",
      id: nuevoArticulo._id,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = articulosRouter;
