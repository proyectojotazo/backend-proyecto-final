require("./lib/connection");

const { PORT } = require("./lib/config");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { errorHandler } = require("./middlewares");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./swagger/swaggerConfig");
const postProgramados = require("./node-cron/index");

const {
  articulosRouter,
  usuariosRouter,
  loginRouter,
  logoutRouter,
  registerRouter,
  passwordResetRouter,
  comentariosRouter,
} = require("./routes");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRouter);
app.use("/logout", logoutRouter)
app.use("/register", registerRouter);
app.use("/password-reset", passwordResetRouter);
app.use("/articles", articulosRouter);
app.use("/users", usuariosRouter);
app.use("/comment", comentariosRouter);
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig.swaggerDocs, swaggerConfig.swaggerOptions)
);
app.use(errorHandler);

// Arranca el cron para publicar los post programados en un futuro
if (process.env.NODE_ENV !== "test") {
  postProgramados();
}

const server = app.listen(PORT, () => {
  console.info(`Server running on port:${PORT}`);
});

module.exports = { app, server };
