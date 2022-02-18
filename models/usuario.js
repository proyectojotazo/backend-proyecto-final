const { Schema, model } = require("mongoose");
// unique-validator comprueba que el dato es único
const uniqueValidator = require("mongoose-unique-validator");

const bcrypt = require("bcrypt");

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "Nombre requerido"],
    index: true,
  },
  apellidos: {
    type: String,
    required: [true, "Apellidos requeridos"],
    index: true,
  },
  email: {
    type: String,
    required: [true, "Email requerido"],
    index: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: [true, "Nickname requerido"],
    index: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
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

// Plugin que comprueba que los campos marcados como `unique` sean únicos
usuarioSchema.plugin(uniqueValidator);

// Función que nos permitirá hashear el password
usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);
};

// Método que nos comprobará que el password introducido es correcto con el hasheado
usuarioSchema.methods.comparePassword = function (passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
};

module.exports = model("Usuario", usuarioSchema);
