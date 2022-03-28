const asyncHandler = require("express-async-handler");

const { Usuario, Comentario, Articulo } = require("../models");
const { sendEmail } = require("../utils");

const comentariosController = {};

/* GET - Controllers */
// visualizar un comentario y sus respuestas
comentariosController.getComentarios = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const comentario = await Comentario.findById(id).populate("usuario", {
    nickname: 1,
  });
  // Si no se encuentra el comentario
  if (!comentario) {
    const error = {
      name: "NotFound",
      status: 404,
      message: "Articulo no encontrado",
    };
    return next(error);
  }
  return res.status(302).json({ comentario });
});

/* POST - Controllers */
// crea comentario
comentariosController.creaComentario = asyncHandler(async (req, res, next) => {
  // recoge el token para identificar el usuario
  const usuarioId = req.userId;

  // Obtenemos el id del articulo
  const idArticulo = req.params.id;
  // buscamos el articulo
  const articulo = await Articulo.findById(idArticulo);

  // creamos el articulo añadiendo el usuario y recogemos el contenido del body
  const nuevoComentario = new Comentario({
    ...req.body,
    usuario: usuarioId,
  });
  // guardamos el comentario dentro del articulo
  const comentario = await nuevoComentario.save();

  await Articulo.findByIdAndUpdate(idArticulo, {
    comentarios: [...articulo.comentarios, nuevoComentario._id],
  });

  // Enviar email al creador del artículo
  const usuarioArticulo = await Usuario.findById(articulo.usuario[0]._id);
  const texto = `${usuarioArticulo.nickname} a respondido a tu articulo con el siguiente comentario "${nuevoComentario.contenido}"`;
  const link = `${texto} \n ${process.env.BASE_URL}/articles/${idArticulo}`;

  await sendEmail(
    usuarioArticulo.email,
    `${usuarioArticulo.nickname} a respondido a tu articulo`,
    link
  );

  return res.status(201).json(comentario);
});

// Responder a un comentario
comentariosController.responderComentario = asyncHandler(
  async (req, res, next) => {
    const usuarioId = req.userId;

    // Obtenemos el id del articulo
    const idComentario = req.params.id;

    const comentario = await Comentario.findById(idComentario);

    const nuevoComentario = new Comentario({
      ...req.body,
      usuario: usuarioId,
    });

    await nuevoComentario.save();
    await Comentario.findByIdAndUpdate(idComentario, {
      respuestas: [...comentario.respuestas, nuevoComentario._id],
    });
    const usuario = await Usuario.findById(usuarioId);
    const texto = `${usuario.nickname} a respondido a tu comentario con el siguiente texto "${nuevoComentario.contenido}"`;
    const link = `${texto} \n ${process.env.BASE_URL}/comment/${idComentario}`;

    const autor = await Usuario.findById(comentario.usuario);
    await sendEmail(
      autor.email,
      `${usuario.nickname} a respondido a tu articulo`,
      link
    );

    return res.status(201).json({ message: "Respuesta Creada" });
  }
);

/* DELETE - Controllers */
// Elimina comentario
comentariosController.deleteComentario = asyncHandler(
  async (req, res, next) => {
    // recoge el token para identificar el usuario
    const usuarioId = req.userId;
    // id del comentario
    const idComment = req.params.id;

    try {
      const comentario = await Comentario.findById(idComment).populate(
        "usuario",
        {
          nickname: 1,
        }
      );
      // Si no se encuentra el comentario
      if (!comentario) {
        const error = {
          name: "NotFound",
          status: 404,
          message: "Comentario no encontrado",
        };
        return next(error);
      }

      const articulo = await Articulo.findOne({ comentarios: idComment });

      const ownerComment = comentario.usuario[0]._id.toString();
      const ownerArticle = articulo.usuario[0].toString();

      // Si el usuario es creador del comentario o artículo, puede eliminarlo
      if (usuarioId === ownerComment || usuarioId === ownerArticle) {
        const articleUpdate = {
          comentarios: articulo.comentarios.filter(
            (comentarioId) => comentarioId.toString() !== idComment
          ),
        };
        await Articulo.findByIdAndUpdate(articulo._id, articleUpdate);
        await Comentario.findByIdAndDelete(idComment);
      } else {
        const error = {
          name: "Unauthorized",
          status: 401,
          message: "No estás autorizado para eliminar el comentario",
        };
        return next(error);
      }

      return res.status(200).json({ message: "Comentario Eliminado" });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = comentariosController;
