const express = require("express");
const articulosRouter = express.Router();
const { Articulo, Usuario } = require("../models");
const { jwtAuth } = require("../middlewares");
const getUserFromJwt = require("../utils/getUserFromJwt");

/* GET */
articulosRouter.get("/", async (req, res, next) => {
  const sort = req.query.sort;

  // Creamos el objeto de filtros
  const filtro = {};
  Object.entries(req.query).forEach(
    ([clave, valor]) => (filtro[clave] = valor)
  );

  try {
    const articulo = await Articulo.lista(filtro, null, sort);
    return res.json({ articles: articulo });
  } catch (error) {
    return next(error);
  }
});

articulosRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const articulo = await Articulo.findById(id).populate("usuario", {
      nombre: 1,
      apellidos: 1,
      email: 1,
      nickname: 1,
    });
    // Si no se encuentra el articulo
    if (!articulo) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Articulo no encontrado",
      };
      return next(error);
    }
    return res.status(302).json({ articulo });
  } catch (error) {
    return next(error);
  }
});

/* PATCH */
articulosRouter.patch("/:id", jwtAuth, async (req, res, next) => {
  // id del artículo
  const id = req.params.id;
  // id del usuario desde el token
  const tokenUser = req.get("Authorization");
  const userIdAuth = getUserFromJwt(tokenUser);
  // datos a actualizar
  const datosActualizar = req.body;

  try {
    // buscamos el artículo y extraemos el id del usuario creador
    const articulo = await Articulo.findById(id);
    // Si no existe el articulo
    if (!articulo) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Articulo no encontrado",
      };
      return next(error);
    }

    const hayCamposVacios = Object.values(datosActualizar).some(
      (campo) => campo === ""
    );

    // Si dejamos algún campo a actualizar vacío
    if (hayCamposVacios) {
      const error = {
        name: "UpdateValidationError",
        status: 400,
        message: "Hay campos vacíos",
      };
      return next(error);
    }

    const userIdArticle = articulo.usuario.toString();

    // si no coinciden, devolvemos el error
    if (userIdAuth !== userIdArticle) {
      const error = {
        name: "Unauthorized",
        status: 401,
        message: "No estas autorizado para actualizar este artículo",
      };
      return next(error);
    }

    await Articulo.findByIdAndUpdate(id, datosActualizar);
    return res.status(200).json({ message: "Artículo actualizado" });
  } catch (error) {
    return next(error);
  }
});

/* DELETE */
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
  const jwtToken =
    req.get("Authorization") || req.query.token || req.body.token;

  const usuarioId = getUserFromJwt(jwtToken);

  // Obtenemos al usuario para actualizarlo con el nuevo post cread
  const usuario = await Usuario.findById(usuarioId);

  try {
    const nuevoArticulo = new Articulo({
      ...req.body,
      usuario: usuarioId,
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
