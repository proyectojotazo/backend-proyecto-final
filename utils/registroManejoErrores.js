const registroManejoErrores = (error) => {
  const errores = { status: 400, name: "FieldValidationError" };
  const clavesError = Object.keys(error.errors);
  clavesError.forEach((clave) => {
    errores[clave] = {
      message: error.errors[clave].message,
    };
    const isUniqueError = errores[clave].message
      .split(" ", 6)
      .includes("unique.");
    if (isUniqueError) {
      errores[clave].message = `Ya existe un usuario con ese ${clave}`;
    }
  });
  return errores;
};

module.exports = registroManejoErrores;
