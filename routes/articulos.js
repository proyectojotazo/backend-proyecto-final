const express = require("express");
const articulosRouter = express.Router();
const { Articulo, Usuario } = require("../models");
const { jwtAuth } = require("../middlewares");
const getUserFromJwt = require("../utils/getUserFromJwt");

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
    estado,
    categorias,
    comentarios,
  } = req.body;

  const jwtToken =
    req.get("Authorization") || req.query.token || req.body.token;

  const usuarioId = getUserFromJwt(jwtToken);

  // Obtenemos al usuario para actualizarlo con el nuevo post cread
  const usuario = await Usuario.findById(usuarioId);

  try {
    const nuevoArticulo = new Articulo({
      titulo,
      archivoDestacado,
      textoIntroductorio,
      contenido,
      estado,
      categorias,
      usuario: usuarioId,
      comentarios,
    });

    await nuevoArticulo.save();

    // Actualizamos los articulos del usuario haciendo uso del operador SPREAD
    await Usuario.findByIdAndUpdate(usuarioId, {
      articulos: {
        creados: [...usuario.articulos.creados, nuevoArticulo._id],
        favoritos: [...usuario.articulos.favoritos],
      },
    });

    res.json({
      msj: "articulo insertado de forma satifactoria",
      id: nuevoArticulo._id,
    });
    
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = articulosRouter;
