const jwt = require("jsonwebtoken");

const jwtAuth = async (req, res, next) => {
  const jwtToken =
    req.get("Authorization") || req.query.token || req.body.token;

  // Comprobamos existencia de Token
  if (!jwtToken) {
    const error = new Error("No se ha proporcionado token");
    error.status = 401;
    return res.status(error.status).json(error.message);
  }

  try {
    await jwt.verify(jwtToken, process.env.JWT_SECRET);
    next();
    return;
  } catch (error) {
    const err = new Error(error.message);
    err.status = 401;
    return res.status(err.status).json(err.message);
  }
};

module.exports = jwtAuth;
