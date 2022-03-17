const articleExists = async (req, res, next) => {
  const { id } = req.params;

  const checkForHexRegExp = /^[0-9a-fA-F]{24}$/;

  if (!checkForHexRegExp.test(id)) {
    const error = new Error();
    error.name = "CastError";
    return next(error);
  }

  next();
};

module.exports = articleExists;
