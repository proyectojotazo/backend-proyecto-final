const { Articulo } = require("../models");

const articleExists = async (req, res, next) => {
  const { id } = req.params;

  const articulo = await Articulo.findById(id);

  if (!articulo) {
    const error = {
      name: "NotFound",
      status: 404,
      message: "Articulo no encontrado",
    };
    return next(error);
  }

  next();
};

module.exports = articleExists;
