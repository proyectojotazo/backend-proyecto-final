const { Schema, model } = require("mongoose");
const mongooseDateFormat = require("mongoose-date-format");

const valores = [
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

const articuloSchema = new Schema({
  titulo: {
    type: String,
    required: [true, "Titulo requerido"],
    index: true,
  },
  archivoDestacado: {
    type: String,
  },
  textoIntroductorio: {
    type: String,
    required: [true, "Texto requerido"],
    index: true,
  },
  contenido: {
    type: String,
    required: [true, "Contenido requerido"],
    index: true,
  },
  fechaBorrador: {
    type: Date,
    inmmutable: true,
    default: Date.now(),
    index: true,
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now(),
    required: [true, "Fecha requerida"],
    index: true,
  },
  estado: {
    type: String,
    validate: [
      {
        validator: (v) => v === "Borrador" || v === "Publicado",
        message: 'El estado debe ser "Borrador" o "Publicado"',
      },
    ],
    index: true,
  },

  categorias: {
    type: [String],
    validate: [
      {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Debes elegir por lo menos una categoria",
      },
    ],
    required: true,
    index: true,
    enum: {
      values: valores,
      message: `Categoria no valida, las categorias disponibles son: ${valores}`,
    },
  },
  usuario: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  comentarios: [{ type: Schema.Types.ObjectId, ref: "Comentarios" }],
  respuesta: {
    idArticulo: [{ type: Schema.Types.ObjectId, ref: "Articulo" }],
    titulo: { type: String },
  },
});

articuloSchema.plugin(mongooseDateFormat);

/*
 Modifica la muestra cuando retornamos el usuario como JSON no mostrando la 
 propiedad __v.
 TODO: Cambiar la propiedad _id por id?
*/
articuloSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString()
    // delete returnedObject._id
    delete returnedObject.fechaBorrador;
    delete returnedObject.__v;
  },
});

articuloSchema.statics.lista = function (filtro, fields, sort) {
  const query = Articulo.find(filtro).populate("usuario", {
    nombre: 1,
    apellidos: 1,
    email: 1,
    nickname: 1,
  });
  query.select(fields);
  query.sort(sort);
  return query.exec();
};

articuloSchema.statics.findByIdPopulated = async function (id) {
  return await this.findById(id)
    .populate("usuario", {
      nombre: 1,
      apellidos: 1,
      email: 1,
      nickname: 1,
    })
    .populate("comentarios", {
      usuario: 1,
      fechaPublicacion: 1,
      contenido: 1,
      respuesta: 1,
    });
};

articuloSchema.statics.listcategories = () => {
  return valores;
};

const Articulo = model("Articulo", articuloSchema);

module.exports = Articulo;
