const mongoose = require("mongoose");

const { server } = require("../../app");
const { Usuario, Articulo } = require("../../models");

const {
  testUser,
  testUser2,
  testArticle,
  api,
  USERS,
  ERRORS,
  userServices,
  apiServices,
} = require("../helpers");

beforeEach(async () => {
  await Usuario.deleteMany({});
  await Articulo.deleteMany({});

  for (const user of USERS) {
    await new Usuario(user).save();
  }
});

describe("/users", () => {
  describe("GET /:id", () => {
    test("devuelve 302 (Found)", async () => {
      const { nickname } = testUser;

      await api
        .get(`/users/${nickname.toLowerCase()}`)
        .expect(302)
        .expect("Content-Type", /application\/json/);

    });
    test("devuelve el usuario correcto", async () => {
      const { nickname } = testUser;

      const response = await api.get(`/users/${nickname.toLowerCase()}`).expect(302);

      const usuarioDevuelto = response.body;

      expect(usuarioDevuelto.nombre).toBe(testUser.nombre);
    });
    test("devuelve error 404 con nickname inexistente", async () => {
      const response = await api
        .get("/users/calabuig")
        .expect(404)
        .expect("Content-Type", /application\/json/);

      const errorDevuelto = response.body;

      expect(errorDevuelto.name).toBe(ERRORS.notFound);
    });
  });
  describe("PATCH /:id", () => {
    // Actualiza correctamente
    test("Actualiza nombre correctamente", async () => {
      // Obtenemos el token
      const token = await apiServices.getToken(testUser);

      // Obtenemos el id del usuario a actualizar
      const userId = await userServices.getUserId(testUser);

      // Generamos el campo a actualizar
      const fieldToUpdate = { nombre: "Actualizado" };

      // Hacemos la peticion 'PATCH'
      await api
        .patch(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(fieldToUpdate)
        .expect(204);

      // Obtenemos el usuario que ha sido actualizado
      const userUpdated = await Usuario.findOne(userId);

      expect(userUpdated.nombre).toBe(fieldToUpdate.nombre);
    });
    test("Actualiza password correctamente", async () => {
      // Obtenemos el token
      const token = await apiServices.getToken(testUser);

      // Obtenemos el id del usuario
      const userId = await userServices.getUserId(testUser);

      // Generamos el campo a actualizar
      const fieldToUpdate = {
        nombre: "Actualizado Pass",
        password: "1234-Abcd",
      };

      await api
        .patch(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(fieldToUpdate)
        .expect(204);

      // Obtenemos el usuario actualizado
      const userUpdated = await Usuario.findOne(userId);

      // Comprobamos que la contraseña se haya modificado correctamente
      const isHashed = await userUpdated.comparePassword(
        fieldToUpdate.password
      );

      expect(isHashed).toBe(true);
    });
    test("Si la id no existe devuelve 404 (NotFound)", async () => {
      // Obtenemos el token
      const token = await apiServices.getToken(testUser);

      const idNotExists = "621600f9a5e09ea330bdc4a6";

      const response = await api
        .patch(`/users/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      const errorName = response.body.name;

      expect(errorName).toBe(ERRORS.notFound);
    });
    test("Si la id del token es diferente de la id del usuario a actualizar devuelve 401", async () => {
      // Obtenemos la id de otro usuario (TEST2) a actualizar
      const otherUserId = await userServices.getUserId(testUser2);

      // Obtenemos el token del usuario TEST que va a actualizar
      const token = await apiServices.getToken(testUser);

      const fieldToUpdate = { nombre: "Actualizado" };
      // Hacemos la peticion path
      const response = await api
        .patch(`/users/${otherUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(fieldToUpdate)
        .expect(401);
      // Debe devolver 401

      const error = JSON.parse(response.error.text);

      expect(error.name).toBe(ERRORS.unauthorized);
    });
  });
  describe("DELETE /:id", () => {
    test("Borra un usuario correctamente", async () => {
      const token = await apiServices.getToken(testUser);

      const id = await userServices.getUserId(testUser);

      await api
        .delete(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const dbUsers = await Usuario.find({});

      expect(dbUsers.length).toBe(USERS.length - 1);
    });
    test("Si no encuentra al usuario devuelve 404", async () => {
      const idNotExists = "6214b593b6c1fa7fee58f955";

      const token = await apiServices.getToken(testUser);

      await api
        .delete(`/users/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    test("Si la id del token es diferente de la id del usuario a borrar devuelve 401", async () => {
      // Obtenemos la id de otro usuario (TEST2) a borrar
      const otherUserId = await userServices.getUserId(testUser2);
      // Obtenemos el token del usuario TEST que va a borrar
      const token = await apiServices.getToken(testUser);

      await api
        .delete(`/users/${otherUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
      // Debe devolver 401
    });
    test("Si se borra al usuario todos sus articulos se deben borrar", async () => {
      // Conseguir token
      const token = await apiServices.getToken(testUser);

      // Creamos el articulo
      await api
        .post("/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(testArticle);

      // Obtenemos el id del usuario a borrar
      const userId = await userServices.getUserId(testUser);

      await api
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const articles = await Articulo.find({});

      expect(articles.length).toBe(0);
    });
    test("Si se borra al usuario debe eliminarse de los usuarios seguidores", async () => {
      await apiServices.followUser(testUser, testUser2);

      // Conseguir el token del usuario a eliminar
      const token = await apiServices.getToken(testUser);
      // Conseguir la id del usuario a eliminar
      const id = await userServices.getUserId(testUser);

      await api
        .delete(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      // Obtenemos el usuario que queda en la bd
      const lastUser = await userServices.getUser(testUser2);

      const { seguidos } = lastUser.usuarios;

      expect(seguidos.length).toBe(0);

      //
    });
  });
  describe("POST /follow/:id", () => {
    test("Un usuario sigue a otro correctamente", async () => {
      await apiServices.followUser(testUser, testUser2);

      const idUserToFollow = await userServices.getUserId(testUser);

      // Obtenemos al usuario seguidor una vez hecha la petición de follow
      const userFollower = await userServices.getUser(testUser2);

      const { seguidos } = userFollower.usuarios;

      // Comprobamos que la id del usuario a seguir se encuentra en el usuario follower
      expect(seguidos.includes(idUserToFollow)).toBe(true);

      // Obtenemos al usuario seguido una vez hecha la petición de follow
      const userFollowed = await userServices.getUser(testUser);

      const { seguidores } = userFollowed.usuarios;
      // Comprobamos que la id del usuario seguidor se encuentra en el usuario a seguir
      expect(seguidores.includes(userFollower.id)).toBe(true);
    });
    test("Un usuario deja de seguir a otro correctamente", async () => {
      // Seguimos al usuario y seguidamente dejamos de seguir
      await apiServices.followUser(testUser, testUser2);
      await apiServices.followUser(testUser, testUser2);

      // Obtenemos la id del usuario seguido
      const idUserToFollow = await userServices.getUserId(testUser);

      // Obtenemos al usuario seguidor una vez hecha la petición de follow
      const userFollower = await userServices.getUser(testUser2);

      const { seguidos } = userFollower.usuarios;

      // Comprobamos que la id del usuario a seguir se encuentra en el usuario follower
      expect(seguidos.includes(idUserToFollow)).not.toBe(true);

      // Obtenemos al usuario seguido una vez hecha la petición de follow
      const userFollowed = await userServices.getUser(testUser);

      const { seguidores } = userFollowed.usuarios;

      // Comprobamos que la id del usuario seguidor se encuentra en el usuario a seguir
      expect(seguidores.includes(userFollower.id)).not.toBe(true);
    });
  });
  describe("POST /articles/favourites/:id", () => {
    test("Debe agregar un articulo a favoritos correctamente", async () => {
      // Agregar articulo
      await apiServices.addArticle(testUser, testArticle);

      // Obtener el articulo a seguir
      const articleToFollow = await Articulo.findOne({
        titulo: testArticle.titulo,
      });

      const articleId = articleToFollow.id;

      await apiServices.followArticle(articleId);

      // Obtener usuario seguidor
      const userFollower = await userServices.getUser(testUser2);

      const { favoritos } = userFollower.articulos;

      // Comprobar que el usuario seguidor tiene el articulo como favorito
      expect(favoritos.length).toBe(1);
      expect(favoritos.includes(articleId)).toBe(true);
    });
    test("Debe quitar un articulo de favoritos correctamente", async () => {
      // Agregar articulo
      await apiServices.addArticle(testUser, testArticle);

      // Obtener el articulo a seguir
      const articleToFollow = await Articulo.findOne({
        titulo: testArticle.titulo,
      });

      const articleId = articleToFollow.id;

      await apiServices.unfollowArticle(articleId);

      // Obtener usuario seguidor
      const userFollower = await userServices.getUser(testUser2);

      const { favoritos } = userFollower.articulos;

      // Comprobar que el usuario seguidor tiene el articulo como favorito
      expect(favoritos.length).toBe(0);
      expect(favoritos.includes(articleId)).not.toBe(true);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
