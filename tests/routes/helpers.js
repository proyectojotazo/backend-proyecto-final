const mongoose = require("mongoose");
const supertest = require("supertest");
const path = require("path");

const { app, server } = require("../../app");
const api = supertest(app);

const { Usuario, Articulo } = require("../../models");

const {
  readDir,
  deleteUserDir,
} = require("../../services/fileHandlerServices");

// Users Tests
const user = {
  nombre: "nombreTest",
  apellidos: "apellidosTest",
  email: "email@gmail.com",
  nickname: "nicknameTest",
  password: "1234Abcd-",
  articulos: { creados: [], favoritos: [] },
  usuarios: { seguidos: [], seguidores: [] },
};

const userTwo = {
  nombre: "otronombreTest",
  apellidos: "otroapellidosTest",
  email: "otroemail@gmail.com",
  nickname: "otronicknameTest",
  password: "1234Abcd-",
  articulos: { creados: [], favoritos: [] },
  usuarios: { seguidos: [], seguidores: [] },
};

// Articles Tests
const article = {
  titulo: "Test titulo articulo",
  textoIntroductorio: "Test texto introductorio articulo",
  contenido: "Test contenido articulo",
  estado: "Publicado",
  categorias: ["html", "css"],
};

const articleWithImage = {
  titulo: "Test titulo articulo con imagen",
  textoIntroductorio: "Test texto introductorio articulo con imagen",
  contenido: "Test contenido articulo con imagen especial",
  estado: "Publicado",
  categorias: ["python", "javascript"],
  archivoDestacado: path.join(__dirname, "../../public/testImages/cama.jpg"),
};

const articleWithImageTwo = {
  titulo: "Test titulo articulo con imagen 2",
  textoIntroductorio: "Test texto introductorio articulo con imagen 2",
  contenido: "Test contenido articulo con imagen 2",
  estado: "Publicado",
  categorias: ["php", "angular"],
  archivoDestacado: path.join(__dirname, "../../public/testImages/cama.jpg"),
};

const newArticleResponse = {
  titulo: "Test titulo articulo en respuesta",
  textoIntroductorio: "Test texto introductorio articulo en respuesta",
  contenido: "Test contenido articulo en respuesta",
  estado: "Publicado",
  categorias: ["mysql"],
};

const newArticleDelayed = {
  titulo: "Test titulo articulo con retraso",
  textoIntroductorio: "Test texto introductorio articulo con retraso",
  contenido: "Test contenido articulo con retraso",
  estado: "Publicado",
  categorias: ["node", "angular", "mongodb"],
  fechaPublicacion: Date.now() - 15000,
};

// Services
const userServices = {
  getUsers: async () => {
    return await Usuario.find({});
  },
  getUserByName: async (userName) => {
    return await Usuario.findOne({ nombre: userName });
  },
  getUserId: async (userName) => {
    const _user = await Usuario.findOne({ nombre: userName.nombre });
    return _user.id;
  },
  deleteAllUsers: async () => {
    await Usuario.deleteMany({});
  },
};

const articlesServices = {
  getArticles: async () => {
    return await Articulo.find({});
  },
  getArticleId: async (article) => {
    const _article = await Articulo.findOne({ titulo: article.titulo });
    return _article.id;
  },
  getArticlesFiltered: async (filters) => {
    return await Articulo.find(filters);
  },
  getArticleById: async (articleId) => {
    return await Articulo.findById(articleId);
  },
  getArticleByTitle: async (articleTitle) => {
    return await Articulo.findOne({ titulo: articleTitle });
  },
  deleteAllArticles: async () => {
    await Articulo.deleteMany({});
  },
};

const apiServices = {
  registerUser: async (userToRegister) => {
    await api.post("/register").send(userToRegister).expect(201);
  },
  loginUser: async (userToLogin) => {
    const response = await api.post("/login").send(userToLogin).expect(200);
    return response.body.token;
  },
  createArticleWithImage: async (token, articleToCreate) => {
    await api
      .post("/articles")
      .set("Authorization", `Bearer ${token}`)
      .field("titulo", articleToCreate.titulo)
      .field("textoIntroductorio", articleToCreate.textoIntroductorio)
      .field("contenido", articleToCreate.contenido)
      .field("estado", articleToCreate.estado)
      .field("categorias", articleToCreate.categorias)
      .field("fechaPublicacion", articleToCreate.fechaPublicacion || Date.now())
      .attach("archivoDestacado", articleToCreate.archivoDestacado)
      .expect(201);
  },
  followUser: async (idUserToFollow, tokenFollower) => {
    await api
      .post(`/users/follow/${idUserToFollow}`)
      .set("Authorization", `Bearer ${tokenFollower}`)
      .expect(204);
  },
  deleteUser: async (idUserToDelete, tokenUserToDelete) => {
    await api
      .delete(`/users/${idUserToDelete}`)
      .set("Authorization", `Bearer ${tokenUserToDelete}`)
      .expect(204);
  },
};

// Functions
const deleteAllFoldersInUpload = async () => {
  const folders = await readDir(path.join(__dirname, "../../public/upload"));
  for (const folder of folders) {
    await deleteUserDir(folder);
  }
};

const closeConnection = () => {
  mongoose.connection.close();
  server.close();
};

module.exports = {
  api,
  user,
  userTwo,
  article,
  articleWithImage,
  articleWithImageTwo,
  newArticleResponse,
  newArticleDelayed,
  userServices,
  articlesServices,
  apiServices,
  deleteAllFoldersInUpload,
  closeConnection
};
