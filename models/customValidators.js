const { CAMPOS } = require("../utils");

const categorias = [
  "html",
  "css",
  "javascript",
  "angular",
  "vue",
  "react",
  "python",
  "php",
  "java",
  "node",
  "laravel",
  "mysql",
  "mongodb",
];

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
      message: "La contraseña debe tener un mínimo 8 carácteres",
    },
    {
      validator: (v) => CAMPOS.password.reg.test(v),
      message: CAMPOS.password.mensaje,
    },
  ],
  categorias: [
    {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "Debes elegir por lo menos una categoria",
    },
    {
      validator: (v) => v.every((el) => categorias.includes(el)),
      message: "Alguna de las siguientes categorías no son válidas: {VALUE}",
    },
  ],
};

module.exports = validators;
