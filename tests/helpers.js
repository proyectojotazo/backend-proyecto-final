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
  categorias: "html",
};

const USERS = [testUser, testUser2];

const ERRORS = {
  CastError: "CastError",
  notFound: "NotFound",
  unauthorized: "Unauthorized",
  registerTest: "RegisterValidationError",
};

const userServices = {
  getUserId: async (usuario) => {
    const user = await Usuario.findOne({ nombre: usuario.nombre });
    return user._id;
  },
  getUser: async (usuario) => {
    return await Usuario.findOne({ nombre: usuario.nombre });
  },
};

const apiServices = {
  getToken: async (usuario) => {
    const response = await api
      .post("/login")
      .send({ email: usuario.email, password: usuario.password });
    const { token } = response.body;
    return token;
  },
  followUser: async (userFollowed, userFollower) => {
    // Conseguir el token del usuario que va a seguir a otro
    const tokenFollower = await apiServices.getToken(userFollower);
    // Conseguir el id del usuario a seguir
    const idUserToFollow = await userServices.getUserId(userFollowed);

    // Seguir al usuario
    await api
      .post(`/users/follow/${idUserToFollow}`)
      .set("Authorization", `Bearer ${tokenFollower}`)
      .expect(204);
  },
  addArticle: async () => {
    const tokenToAddArticle = await apiServices.getToken(testUser);
    await api
      .post("/articles")
      .set("Authorization", `Bearer ${tokenToAddArticle}`)
      .send(testArticle)
      .expect(204);
  },
  followArticle: async (id) => {
    const tokenToFollowArticle = await apiServices.getToken(testUser2);
    await api
      .post(`/users/articles/favourites/${id}`)
      .set("Authorization", `Bearer ${tokenToFollowArticle}`)
      .expect(204);
  },
  unfollowArticle: async (id) => {
    // Para dejar de seguir, debemos primero seguir el articulo
    await apiServices.followArticle(id)
    // La segunda vez, se dejará de seguir
    await apiServices.followArticle(id)
  }
};

module.exports = {
  api,
  testUser,
  testUser2,
  testArticle,
  USERS,
  ERRORS,
  userServices,
  apiServices,
};
