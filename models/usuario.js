const { Schema, model } = require("mongoose");
// unique-validator comprueba que el dato es único
const uniqueValidator = require("mongoose-unique-validator");

const bcrypt = require("bcrypt");

const usuarioSchema = new Schema({
  nombre: {
    // TODO: Validar que solo puede contener letras
    type: String,
    required: [true, "Nombre requerido"],
    index: true,
  },
  apellidos: {
    // TODO: Validar que solo puede contener letras
    type: String,
    required: [true, "Apellidos requeridos"],
    index: true,
  },
  email: {
    // TODO: Validar que sea un email valido
    type: String,
    required: [true, "Email requerido"],
    index: true,
    unique: true,
  },
  nickname: {
    // TODO: Validar que sea un nickname valido
    type: String,
    required: [true, "Nickname requerido"],
    index: true,
    unique: true,
  },
  password: {
    // TODO: Validar que, mínimo 8 caracteres, 1 minuscula, 1 mayuscula, 1 numero y 1 caracter especial
    type: String,
    required: [true, "Password requerido"],
  },
  articulos: {
    creados: [{ type: Schema.Types.ObjectId, ref: "Articulo" }],
    favoritos: [{ type: Schema.Types.ObjectId, ref: "Articulo" }],
  },
  usuarios: {
    seguidos: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
    seguidores: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  },
});

usuarioSchema.plugin(uniqueValidator);

usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);
};

usuarioSchema.methods.comparePassword = function (passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
};

module.exports = model("Usuario", usuarioSchema);
