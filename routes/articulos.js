const express = require("express");
const articulosRouter = express.Router();
const { Articulo, Usuario } = require("../models");
const { jwtAuth } = require("../middlewares");
const getUserFromJwt = require("../utils/getUserFromJwt");

/* GET */
articulosRouter.get("/", async (req, res, next) => {
  try {
    // populate. 
    const articulo = await Articulo.find({}).populate("usuario", {
      nombre: 1,
      apellidos: 1,
      email: 1,
      nickname: 1,
    });
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

// Upload Articles
articulosRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (id && data) {
      await Articulo.findByIdAndUpdate(id, data);
      res.json("Registro Actualizado.");
    } else {
      res.json({ msj: "Datos insuficientes" });
    }
  } catch (error) {
    res.json(error);
  }
});

// Delete Articles
articulosRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    // Obtenemos el artículo que se ha eliminado
    const articuloEliminado = await Articulo.findByIdAndDelete(id);

    // Si la id del articulo no existe nos devolverá el error
    if (!articuloEliminado)
      return res.status(404).json({
        error: {
          message: "Artículo no encontrado",
          id,
        },
      });
    // Obtenemos el id del usuario que creó el articulo eliminado
    const idUsuarioCreador = articuloEliminado.usuario[0];
    // Obtenemos dicho usuario para modificar sus articulos creados
    const usuario = await Usuario.findById(idUsuarioCreador);

    // Actualizamos los articulos del usuario borrando el articulo anteriormente eliminado
    await Usuario.findByIdAndUpdate(idUsuarioCreador, {
      articulos: {
        ...usuario.articulos,
        creados: usuario.articulos.creados.filter((articuloId) => {
          return articuloId.toString() !== id;
        }),
      },
    });

    res
      .status(200)
      .json({ msj: "Articulo borrado de forma satifactoria", isOk: true });

  } catch (error) {
    
    res.status(500).json(error);
  }
});

/* POST */
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
