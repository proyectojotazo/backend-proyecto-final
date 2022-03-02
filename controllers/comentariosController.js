const { Usuario, Comentario, Articulo } = require("../models");
const { getUserFromJwt, sendEmail } = require("../utils");

const comentariosController = {};

/* GET - Controllers */
// visualizar un comentario y sus respuestas
comentariosController.getComentarios = async (req, res, next) => {
  const id = req.params.id;

  try {
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
  } catch (error) {
    return next(error);
  }
};

/* POST - Controllers */
// crea comentario
comentariosController.creaComentario = async (req, res, next) => {
  // recoge el token para identificar el usuario
  const jwtToken = req.get("Authorization").split(" ")[1];

  const usuarioId = getUserFromJwt(jwtToken);

  // Obtenemos el id del articulo
  const idArticulo = req.params.id;
  // buscamos el articulo
  const articulo = await Articulo.findById(idArticulo);

  try {
    // creamos el articulo añadiendo el usuario y recogemos el contenido del body
    const nuevoComentario = new Comentario({
      ...req.body,
      usuario: usuarioId,
    });
    // guardamos el comentario dentro del articulo
    await nuevoComentario.save();
    await Articulo.findByIdAndUpdate(idArticulo, {
      comentarios: [...articulo.comentarios, nuevoComentario._id],
    });
    // TODO enviar email al creador del comentario diciendo que se ha comentado su articulo
    const usuarioArticulo = await Usuario.findById(articulo.usuario[0]._id);
    const texto = `${usuarioArticulo.nickname} a respondido a tu articulo con el siguiente comentario "${nuevoComentario.contenido}"`;
    const link = `${texto} \n ${process.env.BASE_URL}/articles/${idArticulo}`;

    await sendEmail(
      usuarioArticulo.email,
      `${usuarioArticulo.nickname} a respondido a tu articulo`,
      link
    );

    return res.status(201).json({ message: "Comentario Creado" });
  } catch (error) {
    return next(error);
  }
};

// Responder a un comentario (leí mal y pense que era uno de los requisitos)
comentariosController.responderComentario = async (req, res, next) => {
  const jwtToken = req.get("Authorization").split(" ")[1];

  const usuarioId = getUserFromJwt(jwtToken);

  // Obtenemos el id del articulo
  const idComentario = req.params.id;
  const comentario = await Comentario.findById(idComentario);

  try {
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
  } catch (error) {
    return next(error);
  }
};

module.exports = comentariosController;
