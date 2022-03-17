const path = require("path");

const {
  api,
  user,
  userTwo,
  article,
  articleWithImage,
  articleWithImageTwo,
  newArticleResponse,
  newArticleDelayed,
  apiServices,
  userServices,
  articlesServices,
  deleteAllFoldersInUpload,
  closeConnection,
} = require("./helpers");

const rootDir = path.join(__dirname, "../../");

const idNotExists = "6214b593b6c1fa7fee58f955";

beforeEach(async () => {
  // Borramos todos los datos de mongo
  await userServices.deleteAllUsers();
  await articlesServices.deleteAllArticles();

  // Registramos un usuario
  await apiServices.registerUser(user);
  // Logueamos al usuario para obtener el token
  const token = await apiServices.loginUser(user);
  // Creamos dos articulos
  await apiServices.createArticleWithImage(token, article);
  await apiServices.createArticleWithImage(token, articleWithImage);
});

describe("/articles", () => {
  describe("GET /", () => {
    test("Devuelve todos los articulos si no se le pasan parametros", async () => {
      const response = await api
        .get("/articles")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const articlesDB = await articlesServices.getArticles();
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
      const filteredArticlesDB = await articlesServices.getArticlesFiltered(
        filters
      );

      expect(filteredArticles.length).toBe(filteredArticlesDB.length);
    });
    test("Devuelve array vacío si no encuentra articulos con los filtros especificados", async () => {
      const filters = { categorias: "laravel" };
      const response = await api
        .get("/articles")
        .query(filters)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const filteredArticles = response.body;

      expect(filteredArticles.length).toBe(0);
    });
  });
  describe("GET /:id", () => {
    test("Devuelve el articulo con la ID especificada", async () => {
      const articleId = await articlesServices.getArticleId(articleWithImage);

      const response = await api
        .get(`/articles/${articleId}`)
        .expect(302)
        .expect("Content-Type", /application\/json/);

      const articleResponse = response.body;

      expect(articleResponse._id).toBe(articleId);
      expect(articleResponse.titulo).toBe(articleWithImage.titulo);
    });
    test("Devuelve error 404 si no encuentra el artículo", async () => {
      await api
        .get(`/articles/${idNotExists}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);
    });
  });
  describe("POST /", () => {
    test("Crea un articulo correctamente", async () => {
      const articlesBeforeNew = await articlesServices.getArticles();
      // Obtener token para autenticacion (Logear)
      const token = await apiServices.loginUser(user);
      // Crear articulo
      await apiServices.createArticleWithImage(token, articleWithImageTwo);

      const articlesAfterNew = await articlesServices.getArticles();

      expect(articlesAfterNew.length).toBe(articlesBeforeNew.length + 1);
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      await api.post("/articles").set("Authorization", `Bearer `).expect(401);
    });
  });
  describe("PATCH /:id", () => {
    test("Actualiza correctamente un articulo", async () => {
      // Logueamos al usuario propietario del articulo
      const token = await apiServices.loginUser(user);
      // Obtenemos el articulo a actualizar
      const articleToUpdate = await articlesServices.getArticleByTitle(
        article.titulo
      );
      // Creamos los parametros a actualizar
      const paramsToUpdate = {
        titulo: "Titulo Actualizado desde Tests",
      };

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", paramsToUpdate.titulo)
        .expect(204);

      // Obtenemos el articulo actualizado
      const articleUpdated = await articlesServices.getArticleById(
        articleToUpdate.id
      );

      expect(articleUpdated.titulo).toBe(paramsToUpdate.titulo);
    });
    test("Actualiza correctamente un articulo añadiendole una imagen", async () => {
      // Obtenemos el directorio de la imagen a introducir
      const imgDir = path.join(rootDir, "public\\testImages\\cama.jpg");
      // Logueamos al usuario
      const token = await apiServices.loginUser(user);
      // Obtenemos el articulo a añadir imagen
      const articleToUpdate = await articlesServices.getArticleByTitle(
        article.titulo
      );
      // Comprobamos que no tiene imagen
      expect(articleToUpdate.archivoDestacado).toBeUndefined();

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .attach("archivoDestacado", imgDir)
        .expect(204);

      // Obtenemos el articulo actualizado
      const articleUpdated = await articlesServices.getArticleById(
        articleToUpdate.id
      );

      expect(articleUpdated.archivoDestacado).toBeDefined();
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      const articleToUpdate = await articlesServices.getArticleByTitle(
        article.titulo
      );

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer `)
        .expect(401);
    });
    test("Devuelve error 401 si no somos el usuario propietario del articulo", async () => {
      // Obtenemos id del articulo a actualizar
      const articleId = await articlesServices.getArticleId(article);
      // Registramos un usuario sin anuncios
      await apiServices.registerUser(userTwo);
      // Obtenemos token de usuario no propietario del articulo
      const token = await apiServices.loginUser(userTwo);

      // Realizamos la petición de actualización
      await api
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
    });
    test("Devuelve error 404 si no encuentra el articulo", async () => {
      const token = await apiServices.loginUser(user);

      await api
        .patch(`/articles/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/);
    });
    test("Devuelve error 400 si actualizamos un campo vacío", async () => {
      const token = await apiServices.loginUser(user);

      const articleToUpdate = await articlesServices.getArticleByTitle(
        article.titulo
      );

      const paramsToUpdate = {
        titulo: "",
      };

      await api
        .patch(`/articles/${articleToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", paramsToUpdate.titulo)
        .expect(400);
    });
  });
  describe("DELETE /:id", () => {
    test("Borra un articulo correctamente", async () => {
      const articlesBeforeDelete = await articlesServices.getArticles();

      // Obtenemos id del articulo a eliminar
      const articleId = await articlesServices.getArticleId(article);

      // Obtenemos token del usuario propietario
      const token = await apiServices.loginUser(user);

      // Realizamos la peticion de borrado
      await api
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const articlesAfterDelete = await articlesServices.getArticles();

      const articleDeleted = await articlesServices.getArticleByTitle(
        article.titulo
      );

      expect(articlesAfterDelete.length).toBe(articlesBeforeDelete.length - 1);
      expect(articleDeleted).toBeNull();
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      // Obtenemos id del articulo a eliminar
      const articleId = await articlesServices.getArticleId(article);
      // Realizamos la peticion de borrado
      await api
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer `)
        .expect(401);
    });
    test("Devuelve error 404 si no encuentra el articulo", async () => {
      // Obtenemos token del usuario propietario
      const token = await apiServices.loginUser(user);
      // Realizamos la peticion de borrado
      await api
        .delete(`/articles/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
  describe("POST /response/:id", () => {
    test("Se responde correctamente con un articulo", async () => {
      // Registramos al usuario que responderá
      await apiServices.registerUser(userTwo);
      // Obtenemos el token del usuario que responde al articulo
      const token = await apiServices.loginUser(userTwo);
      // Obtenemos el id del articulo al que se responde
      const articleId = await articlesServices.getArticleId(article);

      // Hacemos la petición enviando el articulo en respuesta
      await api
        .post(`/articles/response/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", newArticleResponse.titulo)
        .field("textoIntroductorio", newArticleResponse.textoIntroductorio)
        .field("contenido", newArticleResponse.contenido)
        .field("estado", newArticleResponse.estado)
        .field("categorias", newArticleResponse.categorias)
        .expect(201);

      // Obtenemos el articulo en respuesta desde la bd
      const articleResponse = await articlesServices.getArticleByTitle(
        newArticleResponse.titulo
      );

      // Obtenemos el articulo al que se ha respondido
      const articleResponded = await articlesServices.getArticleByTitle(
        article.titulo
      );

      expect(
        articleResponse.respuesta.idArticulo.includes(articleResponded.id)
      ).toBe(true);
      expect(articleResponse.respuesta.title).toBe(articleResponded.title);
    });
    test("Se responde correctamente con un articulo con imagen", async () => {
      // Obtenemos el directorio de la imagen a introducir
      const imgDir = path.join(rootDir, "public\\testImages\\cama.jpg");
      // Registramos al usuario que responderá
      await apiServices.registerUser(userTwo);
      // Obtenemos el token del usuario que responde al articulo
      const token = await apiServices.loginUser(userTwo);
      // Obtenemos el id del articulo al que se responde
      const articleId = await articlesServices.getArticleId(article);
      // Hacemos la petición enviando el articulo en respuesta
      await api
        .post(`/articles/response/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("titulo", newArticleResponse.titulo)
        .field("textoIntroductorio", newArticleResponse.textoIntroductorio)
        .field("contenido", newArticleResponse.contenido)
        .field("estado", newArticleResponse.estado)
        .field("categorias", newArticleResponse.categorias)
        .attach("archivoDestacado", imgDir)
        .expect(201);

      // Obtenemos el articulo en respuesta desde la bd
      const articleResponse = await articlesServices.getArticleByTitle(
        newArticleResponse.titulo
      );

      // Obtenemos el articulo al que se ha respondido
      const articleResponded = await articlesServices.getArticleByTitle(
        article.titulo
      );

      expect(
        articleResponse.respuesta.idArticulo.includes(articleResponded.id)
      ).toBe(true);

      expect(articleResponse.respuesta.title).toBe(articleResponded.title);

      expect(articleResponse.archivoDestacado).toBeDefined();
    });
    test("Devuelve error 401 si no enviamos token", async () => {
      // Obtenemos el id del articulo al que se responde
      const articleId = await articlesServices.getArticleId(article);

      await api
        .post(`/articles/response/${articleId}`)
        .set("Authorization", `Bearer `)
        .expect(401);
    });
    test("Devuelve error 404 si no encuentra el articulo", async () => {
      // Obtenemos el token del usuario que responde al articulo
      const token = await apiServices.loginUser(user);
      // Hacemos la petición enviando el articulo en respuesta
      await api
        .post(`/articles/response/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
  describe("POST /search", () => {
    test("Debe mostrar el articulo que contiene los parametros especificados", async () => {
      // Pasamos los parametros
      const searchParams = {
        search: "articulo con imagen especial",
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
    });
    test("Si no se pasan parametros debe mostrar todos los articulos", async () => {
      const searchParams = "";

      const response = await api
        .post("/articles/search")
        .send(searchParams)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // Obtenemos los articulos
      const articlesFounded = response.body;
      // Obtenemos los articulos que contiene mongo
      const articlesDB = await articlesServices.getArticles();

      expect(articlesFounded.length).toBe(articlesDB.length);
    });
    test("Si pasamos asc por query debe mostrar de mas antiguo a mas nuevo", async () => {
      // Registramos un usuario
      await apiServices.registerUser(userTwo);
      // Logueamos al usuario para obtener el token
      const token = await apiServices.loginUser(userTwo);
      // Creamos un articulo con fecha anterior
      await apiServices.createArticleWithImage(token, newArticleDelayed);
      // Insertamos un articulo, pasados unos segundos
      const searchParams = "";

      const response = await api
        .post("/articles/search/?asc")
        .send(searchParams)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const articles = response.body;
      const oldArticle = await articlesServices.getArticleByTitle(
        newArticleDelayed.titulo
      );

      expect(articles[0].titulo).toBe(oldArticle.titulo);
    });
  });
});

afterAll(async () => {
  await deleteAllFoldersInUpload();
  closeConnection();
});
