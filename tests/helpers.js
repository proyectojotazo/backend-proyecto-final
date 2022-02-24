const supertest = require("supertest");

const { app } = require("../app");

const { Usuario } = require("../models");

const api = supertest(app);

const testUser = {
  nombre: "Test",
  apellidos: "apellidosTest",
  email: "email@gmail.com",
  nickname: "nicknameTest",
  password: "1234Abcd-",
  articulos: { creados: [], favoritos: [] },
  usuarios: { seguidos: [], seguidores: [] },
};

const testUser2 = {
  nombre: "TestS",
  apellidos: "apellidosTestS",
  email: "email2@gmail.com",
  nickname: "nicknameTest2",
  password: "1234Abcd_",
  articulos: { creados: [], favoritos: [] },
  usuarios: { seguidos: [], seguidores: [] },
};

const testArticle = {
  titulo: "Test titulo articulo",
  textoIntroductorio: "Test texto introductorio articulo",
  contenido: "Test contenido articulo",
  estado: "Publicado",
  categorias: "Pruebas",
};

const USERS = [testUser, testUser2];

const ERRORS = {
  CastError: "CastError",
  NotFound: "NotFound",
  Unauthorized: "Unauthorized",
};

const userServices = {
  getUserId: async () => {
    const user = await Usuario.findOne({ nombre: testUser.nombre });
    return user._id;
  },
  getOtherUserId: async () => {
    const user = await Usuario.findOne({ nombre: testUser2.nombre });
    return user._id;
  },
  getUser: async () => {
    return await Usuario.findOne({ nombre: testUser.nombre });
  },
};

const apiServices = {
  getToken: async () => {
    const response = await api
      .post("/login")
      .send({ email: testUser.email, password: testUser.password });
    const { token } = response.body;
    return token;
  },
};

module.exports = {
  testUser,
  testUser2,
  testArticle,
  USERS,
  ERRORS,
  userServices,
  apiServices,
};
