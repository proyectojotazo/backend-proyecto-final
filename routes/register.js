const registerRouter = require("express").Router();
const { Usuario } = require("../models");

registerRouter.post("/", async (req, res, next) => {
  const avatarDefault = "public\\upload\\avatar_default.jpg";
  try {
    const nuevoUsuario = new Usuario({
      ...req.body,
      avatar: avatarDefault,
    });

    await nuevoUsuario.save();

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = registerRouter;
