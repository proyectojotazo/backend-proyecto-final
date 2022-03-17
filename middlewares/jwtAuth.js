const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const jwtAuth = asyncHandler(async (req, res, next) => {
  const jwtToken = req.get("Authorization").split(" ")[1];

  const decodedToken = await jwt.verify(jwtToken, process.env.JWT_SECRET);
  req.userId = decodedToken.id;
  return next();
});

module.exports = jwtAuth;
