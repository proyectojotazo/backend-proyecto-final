const { Schema, model } = require('mongoose');
// unique-validator comprueba que el dato es único
const validators = require('./customValidators');
const uniqueValidator = require('mongoose-unique-validator');

const Articulo = require('./articulo');

const bcrypt = require('bcrypt');

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'Nombre requerido'],
    index: true,
    validate: validators.nombre,
  },
  apellidos: {
    type: String,
    required: [true, 'Apellidos requeridos'],
    index: true,
    validate: validators.apellidos,
  },
  email: {
    type: String,
    required: [true, 'Email requerido'],
    index: true,
    unique: true,
    validate: validators.email,
  },
  nickname: {
    type: String,
    required: [true, 'Nickname requerido'],
    index: true,
    unique: true,
    validate: validators.nickname,
  },
  password: {
    type: String,
    required: [true, 'Password requerido'],
    validate: validators.password,
  },
  articulos: {
    creados: [{ type: Schema.Types.ObjectId, ref: 'Articulo' }],
    favoritos: [{ type: Schema.Types.ObjectId, ref: 'Articulo' }],
  },
  usuarios: {
    seguidos: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
    seguidores: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
  },
});

// Plugin que comprueba que los campos marcados como `unique` sean únicos
usuarioSchema.plugin(uniqueValidator);

/*
 Modifica la muestra cuando retornamos el usuario como JSON no mostrando la 
 propiedad __v.
 TODO: Cambiar la propiedad _id por id?
*/

usuarioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString()
    // delete returnedObject._id
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

usuarioSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 7);
  next();
});

// Función que nos permitirá hashear el password
// Innecesario, en pre.save ya hasheamos el password
usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);
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
  const { password } = datosActualizar;
  await this.updateOne(datosActualizar, { runValidators: true });
  if (password) {
    this.password = await bcrypt.hash(this.password, 7);
    await this.updateOne({ password: this.password });
  }
};

// Función que nos devuelve el usuario populated
usuarioSchema.statics.findByIdPopulated = async function (id) {
  /* 
  Pongo select en articulos.creados porque creo que es redundante que al pedir
  un usuario populado tambien demos la id del mismo
  */
  return await this.findById(id).populate([
    {
      path: 'articulos.creados',
      model: 'Articulo',
      select: '-usuario',
    },
    {
      path: 'articulos.favoritos',
      model: 'Articulo',
    },
    {
      path: 'usuarios.seguidos',
      model: 'Usuario',
      select: 'nickname nombre articulos.creados',
    },
    {
      path: 'usuarios.seguidores',
      model: 'Usuario',
      select: 'nickname nombre articulos.creados',
    },
  ]);
};

// Función borrado completo del usuario
usuarioSchema.statics.deleteAllData = async function (userToDelete) {
  //  buscamos los articulos que ha creado el usuario
  const articulosId = userToDelete.articulos.creados;
  // borramos todos esos articulos
  await Articulo.deleteMany({ _id: articulosId });
  // borramos al usuario
  await this.findByIdAndDelete({ _id: userToDelete._id });
};

module.exports = model('Usuario', usuarioSchema);
