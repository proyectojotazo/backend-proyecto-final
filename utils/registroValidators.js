const CAMPOS = require('./campos')

const camposValidos = (data) => {
  const camposClave = Object.keys(data);
  const err = { status: 400, name: 'FieldValidationError' };
  camposClave.forEach((campo) => {
    if (!CAMPOS[campo].reg.test(data[campo])) {
      err[campo] = {
        message: CAMPOS[campo].mensaje,
      };
    }
  });

  const sonValidos = Object.keys(err).length === 2;

  return [sonValidos, err];
};

module.exports = camposValidos;
