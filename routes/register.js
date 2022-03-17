const asyncHandler = require("express-async-handler");

const registerRouter = require("express").Router();

const { Usuario } = require("../models");

const { createUserDir } = require("../services/fileHandlerServices");

registerRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const nuevoUsuario = new Usuario({
      ...req.body,
    });

    const newUser = await nuevoUsuario.save();
    const newUserId = newUser.id;

    await createUserDir(newUserId);

    return res.status(201).end();
  })
);

module.exports = registerRouter;
