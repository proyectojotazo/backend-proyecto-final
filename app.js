require("./lib/connection");

// TODO: Configurar multer para subida de imagenes/videos
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { errorHandler } = require("./middlewares");

const { articulosRouter, usuariosRouter } = require("./routes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/articles", articulosRouter);
app.use("/users", usuariosRouter);
// TODO: Sacar login y register rutas
app.use(errorHandler);

module.exports = app;
