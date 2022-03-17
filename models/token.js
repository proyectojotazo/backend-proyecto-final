const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "userId requerido"],
    ref: "Usuario",
  },
  token: {
    type: String,
    required: [true, "token requerido"],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    expires: 3600,
  },
});

const Token = model("Token", tokenSchema);

module.exports = Token;