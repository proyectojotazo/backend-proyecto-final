const supertest = require("supertest");
const mongoose = require("mongoose");

const { app, server } = require("../bin/www");
const { Usuario } = require("../models");

const { testUser, ERRORS, getUserId } = require("./helpers");

const api = supertest(app);

beforeEach(async () => {
  await Usuario.deleteMany({});

  await new Usuario(testUser).save();
});

describe("/users", () => {
  describe("GET /:id", () => {
    test("devuelve 302 (Found)", async () => {
      const userId = await getUserId();

      await api
        .get(`/users/${userId}`)
        .expect(302)
        .expect("Content-Type", /application\/json/);
    });
    test("devuelve el usuario correcto", async () => {
      const userId = await getUserId();

      const response = await api.get(`/users/${userId}`);

      const usuarioDevuelto = response.body.usuario;

      expect(usuarioDevuelto.nombre).toBe(testUser.nombre);
    });
    test("devuelve error 400 con id malformada", async () => {
      const response = await api
        .get("/users/6214b593b6c1fa7fee58f95")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const errorDevuelto = response.body;
      expect(errorDevuelto.name).toBe(ERRORS[errorDevuelto.name]);
    });
    test("devuelve error 404 con id inexistente", async () => {
      const response = await api
        .get("/users/6214b593b6c1fa7fee58f955")
        .expect(404)
        .expect("Content-Type", /application\/json/);

      const errorDevuelto = response.body;
      expect(errorDevuelto.name).toBe(ERRORS[errorDevuelto.name]);
    });
  });
  describe('PATCH /:id', () => { 
  // Necesito un token válido para actualizar   
   })
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
