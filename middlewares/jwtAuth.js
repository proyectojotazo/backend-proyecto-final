const jwt = require("jsonwebtoken");

const jwtAuth = async (req, res, next) => {
  const jwtToken = req.get("Authorization").split(" ")[1];

  try {
    const decodedToken = await jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.userId = decodedToken.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = jwtAuth;
