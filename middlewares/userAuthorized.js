const userAuthorized = (req, res, next) => {
  const { id } = req.params;
  // obtener id de usuario del token
  const userId = req.userId;

  // comprueba si el id del usuario es el mismo que esta logueado
  if (userId !== id) {
    const error = {
      name: "Unauthorized",
      status: 401,
      message: "No estas autorizado para realizar ésta acción",
    };
    return next(error);
  }
  return next();
};

module.exports = userAuthorized;
