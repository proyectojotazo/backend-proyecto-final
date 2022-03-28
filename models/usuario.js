const { Schema, model } = require("mongoose");
// unique-validator comprueba que el dato es único
const validators = require("./customValidators");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const Articulo = require("./articulo");

const {
  deleteFile,
  deleteUserDir,
} = require("../services/fileHandlerServices");
const { isObjectId } = require("../utils");

const usuarioSchema = new Schema({
  avatar: {
    type: String,
    default: "/upload/avatar_default.jpg",
  },
  nombre: {
    type: String,
    required: [true, "Nombre requerido"],
    index: true,
    validate: validators.nombre,
  },
  apellidos: {
    type: String,
    required: [true, "Apellidos requeridos"],
    index: true,
    validate: validators.apellidos,
  },
  email: {
    type: String,
    required: [true, "Email requerido"],
    index: true,
    unique: true,
    validate: validators.email,
  },
  nickname: {
    type: String,
    required: [true, "Nickname requerido"],
    index: true,
    unique: true,
    validate: validators.nickname,
  },
  password: {
    type: String,
    required: [true, "Password requerido"],
    validate: validators.password,
  },
  online: {
    type: Boolean,
    default: false,
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

/*
 Modifica la muestra cuando retornamos el usuario como JSON no mostrando la 
 propiedad __v.
 TODO: Cambiar la propiedad _id por id?
*/

usuarioSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString()
    // delete returnedObject._id
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

usuarioSchema.pre("save", async function (next) {
  this.nickname = this.nickname.toLowerCase();
  this.password = await bcrypt.hash(this.password, Number(process.env.SALT));
  next();
});

// Función que nos permitirá hashear el password
// Innecesario, en pre.save ya hasheamos el password
usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, Number(process.env.SALT));
};

// Método que nos comprobará que el password introducido es correcto con el hasheado
usuarioSchema.methods.comparePassword = function (passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
};

/* 
Método que nos actualizará al usuario, en caso de querer actualizar el password
nos correrá primero los validadores para comprobar que la contraseña no hasehada
cumple con los validadores y luego la hasheará y la introducirá en nuestro
usuario.
*/
usuarioSchema.methods.actualizaUsuario = async function (datosActualizar) {
  const { password, nickname, avatar } = datosActualizar;
  await this.updateOne(datosActualizar, { runValidators: true });

  if (password) {
    this.password = await bcrypt.hash(password, Number(process.env.SALT));
    await this.updateOne({ password: this.password });
  }
  if (nickname) {
    await this.updateOne({ nickname: nickname.toLowerCase() });
  }
  // Si actualizamos el avatar y el avatar que tenemos no es el default
  if (avatar && !this.avatar.includes("default")) {
    // Borramos el avatar anterior
    await deleteFile(this.avatar);
  }
};

// Función que nos devuelve el usuario populated por id o nickname
usuarioSchema.statics.findOnePopulated = async function (paramToSearch) {
  const id = { _id: paramToSearch };
  const usuario = { nickname: paramToSearch.toLowerCase() };

  return await this.findOne(isObjectId(paramToSearch) ? id : usuario).populate([
    {
      path: "articulos.creados",
      model: "Articulo",
      populate: {
        path: "usuario",
        model: "Usuario",
      },
    },
    {
      path: "articulos.favoritos",
      model: "Articulo",
      populate: {
        path: "usuario",
        model: "Usuario",
      },
    },
    {
      path: "usuarios.seguidos",
      model: "Usuario",
      select: "nickname nombre avatar articulos.creados",
    },
    {
      path: "usuarios.seguidores",
      model: "Usuario",
      select: "nickname nombre avatar articulos.creados",
    },
  ]);
};

// Función borrado completo del usuario
usuarioSchema.statics.deleteAllData = async function (userToDelete) {
  // buscamos los articulos que ha creado el usuario
  const articulosId = userToDelete.articulos.creados;
  // borramos todos esos articulos
  await Articulo.deleteMany({ _id: articulosId });
  // buscamos a los usuarios seguidores de éste
  const followers = await this.find({ "usuarios.seguidos": userToDelete._id });

  // eliminamos la referencia a dicho usuario
  for (const follower of followers) {
    const usuarios = {
      seguidos: follower.usuarios.seguidos.filter(
        (userId) => userId.toString() !== userToDelete._id.toString()
      ),

      seguidores: follower.usuarios.seguidores.filter(
        (userId) => userId.toString() !== userToDelete._id.toString()
      ),
    };
    // Actualizamos a los followers del usuario a borrar
    await follower.actualizaUsuario({ usuarios });
  }

  // borramos al usuario
  await this.findByIdAndDelete({ _id: userToDelete._id });

  // borramos la carpeta del usuario
  await deleteUserDir(userToDelete.id);
};

module.exports = model("Usuario", usuarioSchema);
