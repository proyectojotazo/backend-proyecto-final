require("./lib/connection");

// TODO: Configurar multer para subida de imagenes/videos
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { errorHandler } = require("./middlewares");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./swagger/swaggerConfig");

const {
  articulosRouter,
  usuariosRouter,
  loginRouter,
  registerRouter,
  passwordResetRouter,
  comentariosRouter,
} = require("./routes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/password-reset", passwordResetRouter);
app.use("/articles", articulosRouter);
app.use("/users", usuariosRouter);
app.use("/comment", comentariosRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(errorHandler);

module.exports = app;
