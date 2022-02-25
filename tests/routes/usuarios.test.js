const supertest = require("supertest");
const mongoose = require("mongoose");

const { app, server } = require("../../app");
const { Usuario, Articulo } = require("../../models");

const {
  testUser,
  testArticle,
  USERS,
  ERRORS,
  userServices,
  apiServices,
} = require("../helpers");

const api = supertest(app);

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
        .get(`/users/${nickname}`)
        .expect(302)
        .expect("Content-Type", /application\/json/);
    });
    test("devuelve el usuario correcto", async () => {
      const { nickname } = testUser;

      const response = await api.get(`/users/${nickname}`);

      const usuarioDevuelto = response.body.usuario;

      expect(usuarioDevuelto.nombre).toBe(testUser.nombre);
    });
    test("devuelve error 404 con nickname inexistente", async () => {
      const response = await api
        .get("/users/calabuig")
        .expect(404)
        .expect("Content-Type", /application\/json/);

      const errorDevuelto = response.body;

      expect(errorDevuelto.name).toBe(ERRORS[errorDevuelto.name]);
    });
  });
  describe("PATCH /:id", () => {
    // Actualiza correctamente
    test("Actualiza nombre correctamente", async () => {
      // Obtenemos el token
      const token = await apiServices.getToken();

      // Obtenemos el id del usuario a actualizar
      const userId = await userServices.getUserId();

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
      const token = await apiServices.getToken();

      // Obtenemos el id del usuario
      const userId = await userServices.getUserId();

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
      const token = await apiServices.getToken();

      const idNotExists = "621600f9a5e09ea330bdc4a6";

      const response = await api
        .patch(`/users/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      const errorName = response.body.name;

      expect(errorName).toBe(ERRORS[errorName]);
    });
    test("Si la id del token es diferente de la id del usuario a actualizar devuelve 401", async () => {
      // Obtenemos la id de otro usuario (TEST2) a actualizar
      const otherUserId = await userServices.getOtherUserId();

      // Obtenemos el token del usuario TEST que va a actualizar
      const token = await apiServices.getToken();

      const fieldToUpdate = { nombre: "Actualizado" };
      // Hacemos la peticion path
      const response = await api
        .patch(`/users/${otherUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(fieldToUpdate)
        .expect(401);
      // Debe devolver 401

      const error = JSON.parse(response.error.text);

      expect(error.name).toBe(ERRORS[error.name]);
    });
  });
  describe("DELETE /:id", () => {
    test("Borra un usuario correctamente", async () => {
      const token = await apiServices.getToken();

      const id = await userServices.getUserId();

      await api
        .delete(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const dbUsers = await Usuario.find({});

      expect(dbUsers.length).toBe(USERS.length - 1);
    });
    test("Si no encuentra al usuario devuelve 404", async () => {
      const idNotExists = "6214b593b6c1fa7fee58f955";

      const token = await apiServices.getToken();

      await api
        .delete(`/users/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    test("Si la id del token es diferente de la id del usuario a borrar devuelve 401", async () => {
      // Obtenemos la id de otro usuario (TEST2) a borrar
      const otherUserId = await userServices.getOtherUserId();
      // Obtenemos el token del usuario TEST que va a borrar
      const token = await apiServices.getToken();

      await api
        .delete(`/users/${otherUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
      // Debe devolver 401
    });
    test("Si se borra al usuario todos sus articulos se deben borrar", async () => {
      // Conseguir token
      const token = await apiServices.getToken();

      // Creamos el articulo
      await api
        .post("/articles")
        .set("Authorization", `Bearer ${token}`)
        .send(testArticle);

      // Obtenemos el id del usuario a borrar
      const userId = await userServices.getUserId();

      await api
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const articles = await Articulo.find({});

      expect(articles.length).toBe(0);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
