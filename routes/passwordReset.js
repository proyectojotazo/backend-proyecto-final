const { Usuario } = require("../models");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const passwordResetRouter = require("express").Router();

passwordResetRouter.post("/", async (req, res, next) => {
  try {
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

    let token = await Token.findOne({ userId: usuario._id });
    if (!token) {
      token = await new Token({
        userId: usuario._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${usuario._id}/${token.token}`;
    await sendEmail(usuario.email, "Recuperar Contraseña", link);

    res.send("Se ha enviado un link para restablecer tu contraseña a tu email");
  } catch (error) {
    return next(error);
  }
});

passwordResetRouter.post("/:userId/:token", async (req, res, next) => {
  const passwordActualizar = req.body;
  try {
    const usuario = await Usuario.findById(req.params.userId);
    if (!usuario) {
      const error = {
        status: 404,
        name: "UserNotFound",
        message: "El usuario no existe",
      };
      return next(error);
    }

    const token = await Token.findOne({
      userId: usuario._id,
      token: req.params.token,
    });

    if (!token) {
      const error = {
        status: 404,
        name: "TokenNotFound",
        message: "El link de recuperación ha caducado",
      };
      return next(error);
    }

    if (passwordActualizar.password) {
      passwordActualizar.password = await Usuario.hashPassword(
        passwordActualizar.password
      );
    }
    await Usuario.findByIdAndUpdate(usuario._id, passwordActualizar);
    await token.delete();

    res.send("La contraseña se ha sido modificado correctamente");
  } catch (error) {
    return next(error);
  }
});

module.exports = passwordResetRouter;
