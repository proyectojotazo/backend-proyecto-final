const { Usuario } = require("../models");
const { sendEmail } = require("../utils");

const emailServices = {};

emailServices.sendEmailToFollowers = async (usuario, articuloId) => {
  // Obtenemos los seguidores del usuario que esta creando el nuevo articulo
  const idSeguidores =
    usuario.usuarios.seguidores.length > 0 && usuario.usuarios.seguidores;

  if (idSeguidores) {
    const seguidores = await Usuario.find({ _id: { $in: idSeguidores } })
      .select("email")
      .exec();
    const emailSeguidores = seguidores.map((e) => e.email);
    // envio correo de notificación a seguidores
    const link = `${process.env.BASE_URL}/articles/${articuloId}`;
    const texto = `${usuario.nickname} a creado un nuevo articulo: \n ${link}`;
    emailSeguidores.forEach(async (mail) => {
      await sendEmail(
        mail,
        `${usuario.nickname} ha creado un nuevo articulo`,
        texto
      );
    });
  }
};

emailServices.sendEmailToMentioned = async (
  email,
  nickUser,
  nickCreador,
  idArticulo
) => {
  // Enviando email de notificación a quien se menciona
  const asuntoEmail = `${nickCreador} te han mencionado en un artículo!`;
  const link = `${process.env.BASE_URL}/articles/${idArticulo}`;
  const textoEmail = `Hola ${nickUser}, ${nickCreador} te han mencionado en un artículo: \n ${link}`;
  await sendEmail(email, asuntoEmail, textoEmail);
};

module.exports = emailServices;
