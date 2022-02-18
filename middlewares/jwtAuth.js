const jwt = require("jsonwebtoken");

const jwtAuth = async (req, res, next) => {
  const jwtToken =
    req.get("Authorization") || req.query.token || req.body.token;

  // Comprobamos existencia de Token
  if (!jwtToken) {
    const error = {
      name: "Unauthorized",
      status: 401,
      message: "No se ha proporcionado token",
    };
    return next(error);
  }

  try {
    await jwt.verify(jwtToken, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    const err = {
      name: error.name,
      status: 400,
      message: "Error al verificar el token",
    };
    return next(err);
  }
};

module.exports = jwtAuth;
