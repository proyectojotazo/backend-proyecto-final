const { Schema, model } = require("mongoose");

// Esquema de comentario
const comentarioSchema = new Schema({
  usuario: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  fechaPublicacion: {
    type: Date,
    default: () => Date.now(),
    index: true,
  },
  contenido: {
    type: String,
    required: [true, "Contenido requerido"],
    index: true,
  },
  // Responder a un comentario creando otro comentario dentro del comentario
  respuestas: [{ type: Schema.Types.ObjectId, ref: "Comentarios" }],
});

const Comentario = model("Comentarios", comentarioSchema);

module.exports = Comentario;
