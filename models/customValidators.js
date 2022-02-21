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
      "La contraseña debe contener: 1 letra mayúscula, 1 letra minúscula ,1 número y 1 carácter especial de los siguientes: @$!%*?&-_",
  },
};

const validators = {
  nombre: [
    {
      validator: (v) => CAMPOS.nombre.reg.test(v),
      message: CAMPOS.nombre.mensaje,
    },
  ],
  apellidos: [
    {
      validator: (v) => CAMPOS.apellidos.reg.test(v),
      message: CAMPOS.apellidos.mensaje,
    },
  ],
  email: [
    {
      validator: (v) => CAMPOS.email.reg.test(v),
      message: CAMPOS.email.mensaje,
    },
  ],
  nickname: [
    {
      validator: (v) => v.length > 3,
      message: "El nickname debe tener un mínimo de 4 carácteres",
    },
    {
      validator: (v) => CAMPOS.nickname.reg.test(v),
      message: CAMPOS.nickname.mensaje,
    },
  ],
  password: [
    {
      validator: (v) => v.length > 7,
      message: "La contraseña debe tener un mínimo 4 carácteres",
    },
    {
      validator: (v) => CAMPOS.password.reg.test(v),
      message: CAMPOS.password.mensaje,
    },
  ],
};

module.exports = validators;
