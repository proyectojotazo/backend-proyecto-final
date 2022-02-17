const CAMPOS = {
  nombre: {
    reg: /^([a-zA-ZÀ-ÿ\u00f1\u00d1]{1,}(([']){1}[a-zA-ZÀ-ÿ\u00f1\u00d1]{1,})?)(([\s-]){1}[a-zA-ZÀ-ÿ\u00f1\u00d1]{1,}(([']){1}[a-zA-ZÀ-ÿ\u00f1\u00d1]{1,})?)?$/i,
    mensaje: "El nombre tiene carácteres no válidos",
  },
  apellidos: {
    reg: /^([a-zA-ZÀ-ÿ\u00f1\u00d1]{1,}(([']){1}[a-zA-ZÀ-ÿ\u00f1\u00d1]{1,})?)(([\s-]){1}[a-zA-ZÀ-ÿ\u00f1\u00d1]{1,}(([']){1}[a-zA-ZÀ-ÿ\u00f1\u00d1]{1,})?)?$/i,
    mensaje: "Los apellidos tienen cáracteres no válidos",
  },
  email: {
    reg: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    mensaje: "Debe ser un email válido",
  },
  nickname: {
    reg: /^[a-zA-Z0-9À-ÿ\u00f1\u00d1]+([-_]{1}[a-zA-Z0-9À-ÿ\u00f1\u00d1]+)?$/i,
    mensaje: "Debe ser un nickname válido",
  },
  password: {
    reg: /^(?=.*[a-zÀ-ÿ\u00f1\u00d1])(?=.*[A-ZÀ-ÿ\u00f1\u00d1])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-zÀ-ÿ\u00f1\u00d1\d@$!%*?&\-_]{8,}$/,
    mensaje:
      "La contraseña debe tener un mínimo 8 carácteres y debe contener: 1 letra mayúscula, 1 letra minúscula ,1 número y 1 carácter especial de los siguientes: @$!%*?&-_",
  },
};

const camposValidos = (data) => {
  const camposClave = Object.keys(data);
  const err = {};
  camposClave.forEach((campo) => {
    if (!CAMPOS[campo].reg.test(data[campo])) {
      err[campo] = {
        mensaje: CAMPOS[campo].mensaje,
      };
    }
  });

  const sonValidos = Object.keys(err).length === 0;

  return [sonValidos, err];
};

module.exports = camposValidos;
