const mongoose = require("mongoose");
const path = require("path");

const { Usuario, Articulo } = require("../../models");

const {
  api,
  USERS,
  ARTICLES,
  ERRORS,
  testUser,
  testUser2,
  testArticle,
  testArticle2,
  newArticle,
  apiServices,
  userServices,
  articlesServices,
} = require("../helpers");

const { server } = require("../../app");

const idNotExists = "6214b593b6c1fa7fee58f955";

const newArticleSearch = {
  titulo: "Testing nuevo",
  textoIntroductorio: "Introduccion al testing",
  contenido: "Articulo creado para prueba en /search",
  estado: "Publicado",
  fechaPublicacion: Date.now(),
  categorias: ["python", "css", "javascript"],
};

beforeEach(async () => {
  // Borramos todos los datos
  await Usuario.deleteMany({});
  await Articulo.deleteMany({});

  // Creamos usuarios
  for (const user of USERS) {
    await new Usuario(user).save();
  }

  // Obtenemos el id del usuario que será el creador de articulos
  const userArticlesCreator = await userServices.getUser(testUser);

  const idArr = [];
  // Insertamos articulos en la bd
  for (const article of ARTICLES) {
    const artCr = await new Articulo({
      ...article,
      usuario: userArticlesCreator.id,
      archivoDestacado: undefined,
    }).save();
    idArr.push(artCr.id);
  }

  const data = {
    articulos: {
      creados: idArr,
      favoritos: [...userArticlesCreator.articulos.favoritos],
    },
  };

  // Actualizamos al usuario para que tenga la id de los anuncios creados
  await userArticlesCreator.actualizaUsuario(data);
});

describe("/articles", () => {
  describe("GET /", () => {
    test("Devuelve todos los articulos si no se le pasan parametros", async () => {
      const response = await api
        .get("/articles")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const articlesDB = await Articulo.find({});
      const articlesResponse = response.body;

      expect(articlesResponse.length).toBe(articlesDB.length);
    });
    test("Devuelve los articulos filtrados por categoria", async () => {
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
    test("Devuelve array vacío si no encuentra articulos con los filtros especificados", async () => {
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
    test("Devuelve el articulo con la ID especificada", async () => {
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
    test("Crea un articulo correctamente", async () => {
      const articlesBeforeNew = await Articulo.find({});
      // Obtener token para autenticacion (Logear)
      const token = await apiServices.getToken(testUser);
      // Crear articulo
      await api
        .post("/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .expect(201);

      const articlesAfterNew = await Articulo.find({});

      expect(articlesAfterNew.length).toBe(articlesBeforeNew.length + 1);
    });
    test.skip("Crea un articulo correctamente con una imagen", async () => {
      const articlesBeforeNew = await Articulo.find({});
      // Obtenemos el directorio de la imagen a introducir
      const dirSplitted = __dirname
        .split("\\")
        .filter((folder) => folder !== "routes" && folder !== "tests")
        .join("\\");

      const imgDir = path.join(dirSplitted, "public\\images\\cama.jpg");

      // Obtener token para autenticacion (Logear)
      const token = await apiServices.getToken(testUser);
      // Crear articulo
      await api
        .post("/articles")
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", newArticle.titulo)
        .field("textoIntroductorio", newArticle.textoIntroductorio)
        .field("contenido", newArticle.contenido)
        .field("estado", newArticle.estado)
        .field("categorias", newArticle.categorias)
        .attach("archivoDestacado", imgDir)
        .expect(201);

      const articlesAfterNew = await Articulo.find({});

      expect(articlesAfterNew.length).toBe(articlesBeforeNew.length + 1);
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
    test.skip("Actualiza correctamente un articulo con imagen", async () => {
      // Obtenemos el directorio de la imagen a introducir
      const dirSplitted = __dirname
        .split("\\")
        .filter((folder) => folder !== "routes" && folder !== "tests")
        .join("\\");

      const imgDir = path.join(dirSplitted, "public\\images\\cama.jpg");

      const token = await apiServices.getToken(testUser);

      const articleToUpdate = await articlesServices.getArticle(testArticle);

      const paramsToUpdate = {
        titulo: "Titulo Actualizado desde Tests",
      };

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", paramsToUpdate.titulo)
        .attach("archivoDestacado", imgDir)
        .expect(204);

      const articleUpdated = await Articulo.findOne({
        titulo: paramsToUpdate.titulo,
      });

      expect(articleUpdated.titulo).toBe(paramsToUpdate.titulo);
      expect(articleUpdated.id).toBe(articleToUpdate.id);
      expect(articleUpdated.archivoDestacado).toBeDefined();
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
    test("Devuelve error 401 si no somos el usuario propietario del articulo", async () => {
      // Obtenemos id del articulo a actualizar
      const articleId = await articlesServices.getArticleId(testArticle);
      // Obtenemos token de usuario no propietario del articulo
      const tokenWrongUser = await apiServices.getToken(testUser2);

      const paramsToUpdate = {
        titulo: "Titulo Actualizado desde Tests",
      };

      // Realizamos la petición de actualización
      await api
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${tokenWrongUser}`)
        .send(paramsToUpdate)
        .expect(401);
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
    test("Devuelve error 400 si actualizamos un campo vacío", async () => {
      const token = await apiServices.getToken(testUser);

      const articleToUpdate = await articlesServices.getArticle(testArticle);

      const paramsToUpdate = {
        titulo: "",
      };

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(paramsToUpdate)
        .expect(400);
    });
  });
  describe("DELETE /:id", () => {
    test("Borra un articulo correctamente", async () => {
      const articlesBeforeDelete = await Articulo.find({});
      const userBeforeDelete = await userServices.getUser(testUser);

      // Obtenemos id del articulo a eliminar
      const articleId = await articlesServices.getArticleId(testArticle);
      // Obtenemos token del usuario propietario
      const token = await apiServices.getToken(testUser);
      // Realizamos la peticion de borrado
      await api
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const articlesAfterDelete = await Articulo.find({});

      const articleDeleted = await articlesServices.getArticle(testArticle);

      const userAfterDelete = await userServices.getUser(testUser);

      expect(articlesAfterDelete.length).toBe(articlesBeforeDelete.length - 1);
      expect(articleDeleted).toBeNull();
      expect(userAfterDelete.articulos.creados.length).toBe(
        userBeforeDelete.articulos.creados.length - 1
      );
      expect(userAfterDelete.articulos.creados.includes(articleId)).toBe(false);
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      // Obtenemos id del articulo a eliminar
      const articleId = await articlesServices.getArticleId(testArticle);
      // Realizamos la peticion de borrado
      await api
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer `)
        .expect(401);
    });
    test("Devuelve error 404 si no encuentra el articulo", async () => {
      // Obtenemos token del usuario propietario
      const token = await apiServices.getToken(testUser);
      // Realizamos la peticion de borrado
      await api
        .delete(`/articles/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
  describe("POST /response/:id", () => {
    test("Se responde correctamente con un articulo", async () => {
      // Obtenemos el token del usuario que responde al articulo
      const token = await apiServices.getToken(testUser2);
      // Obtenemos el id del articulo al que se responde
      const articleId = await articlesServices.getArticleId(testArticle);
      // Hacemos la petición enviando el articulo en respuesta
      await api
        .post(`/articles/response/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .expect(201);

      // Obtenemos el articulo en respuesta desde la bd
      const articleResponse = await articlesServices.getArticle(newArticle);

      // Obtenemos el articulo al que se ha respondido
      const articleResponded = await articlesServices.getArticle(testArticle);

      expect(articleResponse.respuesta.idArticulo.toString()).toBe(
        articleId.toString()
      );
      expect(articleResponse.respuesta.title).toBe(articleResponded.title);
    });
    test.skip("Se responde correctamente con un articulo con imagen", async () => {
      // Obtenemos el directorio de la imagen a introducir
      const dirSplitted = __dirname
        .split("\\")
        .filter((folder) => folder !== "routes" && folder !== "tests")
        .join("\\");

      const imgDir = path.join(dirSplitted, "public\\images\\cama.jpg");
      // Obtenemos el token del usuario que responde al articulo
      const token = await apiServices.getToken(testUser2);
      // Obtenemos el id del articulo al que se responde
      const articleId = await articlesServices.getArticleId(testArticle);
      // Hacemos la petición enviando el articulo en respuesta
      await api
        .post(`/articles/response/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", newArticle.titulo)
        .field("textoIntroductorio", newArticle.textoIntroductorio)
        .field("contenido", newArticle.contenido)
        .field("estado", newArticle.estado)
        .field("categorias", newArticle.categorias)
        .attach("archivoDestacado", imgDir)
        .expect(201);

      // Obtenemos el articulo en respuesta desde la bd
      const articleResponse = await articlesServices.getArticle(newArticle);

      // Obtenemos el articulo al que se ha respondido
      const articleResponded = await articlesServices.getArticle(testArticle);

      expect(articleResponse.respuesta.idArticulo.toString()).toBe(
        articleId.toString()
      );
      expect(articleResponse.respuesta.title).toBe(articleResponded.title);

      expect(articleResponse.archivoDestacado).toBeDefined();
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      // Obtenemos el id del articulo al que se responde
      const articleId = await articlesServices.getArticleId(testArticle);
      // Hacemos la petición enviando el articulo en respuesta
      await api
        .post(`/articles/response/${articleId}`)
        .set("Authorization", `Bearer `)
        .send(newArticle)
        .expect("Content-Type", /application\/json/)
        .expect(401);
    });
    test("Devuelve error 404 si no encuentra el articulo", async () => {
      // Obtenemos el token del usuario que responde al articulo
      const token = await apiServices.getToken(testUser2);
      // Hacemos la petición enviando el articulo en respuesta
      await api
        .post(`/articles/response/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newArticle)
        .expect(404);
    });
  });
  describe("POST /search", () => {
    test("Debe mostrar el articulo que contiene los parametros especificados", async () => {
      // Pasamos los parametros
      const searchParams = {
        search: "articulo2",
      };

      // Hacemos la petición con los parametros
      const response = await api
        .post("/articles/search")
        .send(searchParams)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // Con los parametros especificados solo encontrará un articulo
      const articleFounded = response.body[0];

      expect(response.body.length).toBe(1);
      expect(articleFounded).toBeDefined();
      expect(articleFounded.title).toBe(testArticle2.title);
    });
    test("Si no se pasan parametros debe mostrar todos los articulos", async () => {
      const searchParams = "";

      const response = await api
        .post("/articles/search")
        .send(searchParams)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const articlesFounded = response.body;

      expect(articlesFounded.length).toBe(ARTICLES.length);
    });
    test("Si pasamos asc por query debe mostrar de mas antiguo a mas nuevo", async () => {
      const user = await userServices.getUser(testUser2);

      await new Articulo({
        ...newArticleSearch,
        usuario: user.id,
      }).save();
      // Insertamos un articulo, pasados unos segundos
      const searchParams = "";

      const response = await api
        .post("/articles/search/?asc")
        .send(searchParams)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const searchArticle = await articlesServices.getArticle(newArticleSearch);

      const articlesFounded = response.body;
      const lastArticleSorted = articlesFounded.length - 1;

      expect(articlesFounded.length).toBe(ARTICLES.length + 1);
      expect(articlesFounded[lastArticleSorted].titulo).toBe(
        searchArticle.titulo
      );
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
