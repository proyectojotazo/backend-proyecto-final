const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Usuario, Articulo } = require("../../models");
const {
  api,
  USERS,
  ARTICLES,
  ERRORS,
  testUser,
  testArticle,
  newArticle,
  apiServices,
  userServices,
  articlesServices,
} = require("../helpers");

const { server } = require("../../app");

const idNotExists = "6214b593b6c1fa7fee58f955";

beforeEach(async () => {
  // Borramos todos los datos
  await Usuario.deleteMany({});
  await Articulo.deleteMany({});

  // Creamos usuarios
  for (const user of USERS) {
    await new Usuario(user).save();
  }

  // Obtenemos el id del usuario que será el creador de articulos
  const userArticlesCreatorId = await userServices.getUserId(testUser);

  // Insertamos articulos en la bd
  for (const article of ARTICLES) {
    await new Articulo({
      ...article,
      usuario: userArticlesCreatorId,
      archivoDestacado: undefined,
    }).save();
  }
});

describe("/articles", () => {
  describe("GET /", () => {
    test("Devuelve todos los anuncios si no se le pasan parametros", async () => {
      const response = await api
        .get("/articles")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const articlesDB = await Articulo.find({});
      const articlesResponse = response.body;

      expect(articlesResponse.length).toBe(articlesDB.length);
    });
    test("Devuelve los anuncios filtrados por categoria", async () => {
      const filters = { categorias: "css" };
      const response = await api
        .get("/articles")
        .query(filters)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const filteredArticles = response.body;
      const filteredArticlesDB = await Articulo.find(filters);

      expect(filteredArticles.length).toBe(filteredArticlesDB.length);
    });
    test("Devuelve array vacío si no encuentra anuncios con los filtros especificados", async () => {
      const filters = { categorias: "python" };
      const response = await api
        .get("/articles")
        .query(filters)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const filteredArticles = response.body;
      const filteredArticlesDB = await Articulo.find(filters);

      expect(filteredArticles.length).toBe(filteredArticlesDB.length);
    });
  });
  describe("GET /:id", () => {
    test("Devuelve el anuncio con la ID especificada", async () => {
      const article = await articlesServices.getArticle(testArticle);

      const response = await api
        .get(`/articles/${article.id}`)
        .expect(302)
        .expect("Content-Type", /application\/json/);

      const articleResponse = response.body;

      expect(articleResponse._id).toBe(article.id);
      expect(articleResponse.titulo).toBe(article.titulo);
    });
    test("Devuelve error 404 si no encuentra el artículo", async () => {
      const response = await api
        .get(`/articles/${idNotExists}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      const error = response.body;

      expect(error.name).toBe(ERRORS.notFound);
    });
  });
  describe("POST /", () => {
    test("Crea un anuncio correctamente", async () => {
      const articlesBeforeNew = await Articulo.find({});
      // Obtener token para autenticacion (Logear)
      const token = await apiServices.getToken(testUser);
      // Crear anuncio
      await api
        .post("/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .expect(201);

      const articlesAfterNew = await Articulo.find({});

      expect(articlesAfterNew.length).toBe(articlesBeforeNew.length + 1);
    });
    test.skip("Crea un anuncio correctamente con una imagen", async () => {
      // const articlesBeforeNew = await Articulo.find({});
      // Obtener token para autenticacion (Logear)
      const token = await apiServices.getToken(testUser);
      // Crear anuncio
      await api
        .post("/articles")
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", newArticle.titulo)
        .field("textoIntroductorio", newArticle.textoIntroductorio)
        .field("contenido", newArticle.contenido)
        .field("estado", newArticle.estado)
        .field("categorias", newArticle.categorias)
        .attach(
          "archivoDestacado",
          fs.readFileSync(path.join(__dirname, "/img/cama.jpg"))
        )
        .expect(201);

      
      // const art = await Articulo.findOne({ titulo: newArticle.titulo });
      
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      await api
        .post("/articles")
        .set("Authorization", `Bearer `)
        .send(newArticle)
        .expect(401);
    });
  });
  describe("PATCH /:id", () => {
    test("Actualiza correctamente un articulo", async () => {
      const token = await apiServices.getToken(testUser);

      const articleToUpdate = await articlesServices.getArticle(testArticle);

      const paramsToUpdate = {
        titulo: "Titulo Actualizado desde Tests",
      };

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(paramsToUpdate)
        .expect(204);

      const articleUpdated = await Articulo.findOne({
        titulo: paramsToUpdate.titulo,
      });

      expect(articleUpdated.titulo).toBe(paramsToUpdate.titulo);
      expect(articleUpdated.id).toBe(articleToUpdate.id);
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      const articleToUpdate = await articlesServices.getArticle(testArticle);

      const paramsToUpdate = {
        titulo: "Titulo Actualizado desde Tests",
      };

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer `)
        .send(paramsToUpdate)
        .expect(401)
        .expect("Content-Type", /application\/json/);
    });
    test("Devuelve error 404 si no encuentra el articulo", async () => {
      const token = await apiServices.getToken(testUser);

      const paramsToUpdate = {
        titulo: "Titulo Actualizado desde Tests",
      };

      await api
        .patch(`/articles/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .send(paramsToUpdate)
        .expect(404)
        .expect("Content-Type", /application\/json/);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
