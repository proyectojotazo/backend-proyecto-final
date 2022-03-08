const asyncHandler = require("express-async-handler");

const registerRouter = require("express").Router();
const { Usuario } = require("../models");

registerRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const nuevoUsuario = new Usuario({
      ...req.body,
    });

    await nuevoUsuario.save();

    return res.status(201).end();
  })
);

module.exports = registerRouter;
