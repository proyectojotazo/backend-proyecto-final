const passwordResetRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const { Usuario, Token } = require("../models");
const { sendEmail, camposValidos } = require("../utils");

passwordResetRouter.post(
  "/",
  asyncHandler(async (req, res, next) => {
    // obtener usuario a través del email para recuperar la contraseña
    const usuario = await Usuario.findOne({ email: req.body.email });

    // Si no existe usuario con ese email, devolvemos el error
    if (!usuario) {
      const error = {
        status: 404,
        name: "EmailNotFound",
        message: "No existe un usuario con este email",
      };
      return next(error);
    }

    // si hay token activo para el usuario, lo obtiene, si no genera un nuevo token para recuperar contraseña
    let token = await Token.findOne({ userId: usuario._id });
    if (!token) {
      token = await new Token({
        userId: usuario._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    // link enviado al email del usuario
    const link = `${process.env.BASE_URL}/password-reset/${usuario._id}/${token.token}`;
    // email, asunto y texto a enviar en el correo de recuperación
    await sendEmail(usuario.email, "Recuperar Contraseña", link);

    // res.send("Se ha enviado un correo electrónico para restablecer la contraseña");
    return res.status(200).json({
      message:
        "Se ha enviado un correo electrónico para restablecer la contraseña",
    });
  })
);

passwordResetRouter.post(
  "/:userId/:token",
  asyncHandler(async (req, res, next) => {
    const passwordActualizar = req.body;
    const [validos, error] = camposValidos(passwordActualizar);
    // Se comprueba si la contraseña no es válida
    if (!validos) return next(error);

    // obtener usuario con el id de la ruta
    const usuario = await Usuario.findById(req.params.userId);
    // si no existe usuario, devuelve error
    if (!usuario) {
      const error = {
        status: 404,
        name: "UserNotFound",
        message: "El usuario no existe",
      };
      return next(error);
    }

    // obtener token con el id de usuario y token de la ruta
    const token = await Token.findOne({
      userId: usuario._id,
      token: req.params.token,
    });
    // si no existe token, devuelve error
    if (!token) {
      const error = {
        status: 404,
        name: "TokenNotFound",
        message: "El link de recuperación ha caducado",
      };
      return next(error);
    }

    // si se ha proporcionado password, convertirlo para almacenarlo en bd
    if (passwordActualizar.password) {
      passwordActualizar.password = await Usuario.hashPassword(
        passwordActualizar.password
      );
    } else {
      const error = {
        status: 400,
        name: "PasswordFailed",
        message: "No ha proporcionado nueva contraseña o es incorrecta",
      };
      return next(error);
    }

    // buscar y actualizar usuario con nuevo password
    await Usuario.findByIdAndUpdate(usuario._id, passwordActualizar);
    // eliminar token después de su uso
    await token.delete();

    // res.send("La contraseña ha sido modificada correctamente");
    return res
      .status(200)
      .json({ message: "La contraseña ha sido modificada correctamente" });
  })
);

module.exports = passwordResetRouter;
