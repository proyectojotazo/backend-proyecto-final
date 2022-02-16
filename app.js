require("./lib/connection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const { articulosRouter, usuariosRouter } = require("./routes");
const LoginController = require("./controllers/loginController");
const loginController = new LoginController();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/articles", articulosRouter);
app.use("/users", usuariosRouter);
app.post("/login", loginController.post);

module.exports = app;
