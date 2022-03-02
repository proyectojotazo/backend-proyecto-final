const { Articulo, Usuario } = require("../models");
const { getUserFromJwt, deleteF } = require("../utils");
const { deleteFileOfPath } = deleteF;

const articulosController = {};

/* GET - Controllers */
articulosController.getArticulos = async (req, res, next) => {
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
};

articulosController.getArticulo = async (req, res, next) => {
  const id = req.params.id;

  try {
    const articulo = await Articulo.findByIdPopulated(id);

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
};

articulosController.getCategorias = async (req, res, next) => {
  try {
    return res.json(Articulo.listcategories());
  } catch (error) {
    return next(error);
  }
};

/* POST - Controllers */
articulosController.creaArticulo = async (req, res, next) => {
  const jwtToken = req.get("Authorization").split(" ")[1];
  const usuarioId = getUserFromJwt(jwtToken);
  // Si se envia archivo, se guarda el path
  const archivo = req.file ? req.file.path : undefined;

  // Obtenemos al usuario para actualizarlo con el nuevo post creado
  const usuario = await Usuario.findById(usuarioId);

  try {
    const nuevoArticulo = new Articulo({
      ...req.body,
      usuario: usuarioId,
      archivoDestacado: archivo,
    });

    await nuevoArticulo.save();

    // Actualizamos los articulos del usuario haciendo uso del operador SPREAD
    await Usuario.findByIdAndUpdate(usuarioId, {
      articulos: {
        creados: [...usuario.articulos.creados, nuevoArticulo._id],
        favoritos: [...usuario.articulos.favoritos],
      },
    });

    return res.status(201).end();
  } catch (error) {
    if (req.file) deleteFileOfPath(archivo);
    return next(error);
  }
};

// Creación de un articulo en respuesta a otro articulo
articulosController.respuestaArticulo = async (req, res, next) => {
  const jwtToken = req.get("Authorization").split(" ")[1];
  const usuarioId = getUserFromJwt(jwtToken);

  // Si se envia archivo, se guarda el path
  const archivo = req.file ? req.file.path : undefined;
  // Obtenemos el id del articulo para poder responderlo
  const idArticulo = req.params.id;

  try {
    // buscar el articulo
    const articulo = await Articulo.findById(idArticulo);
    // buscamos el usuario el cual esta respondiendo el articulo creado
    const usuario = await Usuario.findById(usuarioId);
    // creamos el articulo en respuesta al original
    const respuestaArticulo = new Articulo({
      ...req.body,
      usuario: usuarioId,
      archivoDestacado: archivo,
      respuesta: {
        idArticulo: idArticulo,
        titulo: articulo.titulo,
      },
    });

    await respuestaArticulo.save();

    // Creamos el nuevo articulo en respuesta al articulo original
    await Usuario.findByIdAndUpdate(usuarioId, {
      articulos: {
        creados: [...usuario.articulos.creados, respuestaArticulo._id],
        favoritos: [...usuario.articulos.favoritos],
      },
    });

    return res.status(204).end();
  } catch (error) {
    if (req.file) deleteFileOfPath(archivo);
    return next(error);
  }
};

articulosController.buscarArticulos = async (req, res, next) => {
  const busqueda = req.body.search;
  const order = req.query.asc !== undefined ? 1 : -1;
  const regex = new RegExp(busqueda, "i");
  try {
    const result = await Articulo.find()
      .or([
        { titulo: { $regex: regex } },
        { textoIntroductorio: { $regex: regex } },
        { contenido: { $regex: regex } },
      ])
      .sort({ fechaPublicacion: order });

    return res.status(200).json({ result });
  } catch (error) {
    return next(error);
  }
};

/* PATCH - Controllers */
articulosController.actualizarArticulo = async (req, res, next) => {
  // id del artículo
  const id = req.params.id;
  // id del usuario desde el token
  const tokenUser = req.get("Authorization").split(" ")[1];
  const userIdAuth = getUserFromJwt(tokenUser);
  // datos a actualizar
  const datosActualizar = req.body;
  if (req.file) datosActualizar.archivoDestacado = req.file.path;

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

    if (
      (datosActualizar.archivoDestacado && articulo.archivoDestacado) !==
      undefined
    ) {
      deleteFileOfPath(articulo.archivoDestacado);
    }

    return res.status(200).json({ message: "Artículo actualizado" });
  } catch (error) {
    if (req.file) deleteFileOfPath(datosActualizar.archivoDestacado);
    return next(error);
  }
};

/* DELETE - Controllers */
articulosController.borraArticulo = async (req, res, next) => {
  try {
    // id del usuario desde el token
    const tokenUser = req.get("Authorization").split(" ")[1];
    const userIdAuth = getUserFromJwt(tokenUser);

    // id del artículo proporcionado desde la ruta
    const id = req.params.id;

    // obtenemos el artículo por id
    const articulo = await Articulo.findById(id);

    // Si la id del articulo no existe nos devolverá el error
    if (!articulo) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Artículo no encontrado",
      };
      return next(error);
    }

    // extraemos el id del usuario creador del artículo
    const userIdArticle = articulo.usuario.toString();

    // si no coinciden ambos usuarios, devolvemos el error
    if (userIdAuth !== userIdArticle) {
      const error = {
        name: "Unauthorized",
        status: 401,
        message: "No estas autorizado para eliminar este artículo",
      };
      return next(error);
    }

    // Eliminamos el artículo por id
    await Articulo.findByIdAndDelete(id);

    // Eliminamos el archivo del artículo si lo hubiera
    if (articulo.archivoDestacado) {
      deleteFileOfPath(articulo.archivoDestacado);
    }

    // Obtenemos dicho usuario para modificar sus articulos creados
    const usuario = await Usuario.findById(userIdArticle);

    // Actualizamos los articulos del usuario borrando el articulo anteriormente eliminado
    await Usuario.findByIdAndUpdate(userIdArticle, {
      articulos: {
        ...usuario.articulos,
        creados: usuario.articulos.creados.filter((articuloId) => {
          return articuloId.toString() !== id;
        }),
      },
    });

    return res.status(200).json({ message: "Articulo borrado" });
  } catch (error) {
    return next(error);
  }
};

module.exports = articulosController;
