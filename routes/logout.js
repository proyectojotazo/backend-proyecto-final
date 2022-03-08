const logoutRouter = require("express").Router();

const { Usuario } = require("../models");

const { userExists } = require("../middlewares");

logoutRouter.post("/:id", userExists, async (req, res, next) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);
  await usuario.actualizaUsuario({ online: false });
  res.status(204).end();
});

module.exports = logoutRouter;
