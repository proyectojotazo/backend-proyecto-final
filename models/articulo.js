const { Schema, model } = require("mongoose");

const articuloSchema = new Schema({
  titulo: {
    type: String,
    required: [true, "Titulo requerido"],
    index: true,
  },
  archivoDestacado: {
    // Opcional? Puede ser video o imagen
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
  fechaPublicacion: {
    // TODO: Validar que la fecha de publicación no se anterior al dia actual
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
    // TODO: Validar que debe de contener como mínimo una categoría?
    // Acordar categorías
    type: [String],
    index: true,
  },
  usuario: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  comentarios: {
    type: [String],
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

const Articulo = model("Articulo", articuloSchema);

module.exports = Articulo;
