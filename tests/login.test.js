const supertest = require("supertest");
const mongoose = require("mongoose");

const { app, server } = require("../bin/www");

const { Usuario } = require("../models");

const { testUser, testUser2, userServices } = require("./helpers");

const { getUserFromJwt } = require("../utils");

const api = supertest(app);

const userData = {
  email: testUser.email,
  password: testUser.password,
};

const userNotExistsData = {
  email: testUser2.email,
  password: testUser2.password,
};

beforeEach(async () => {
  await Usuario.deleteMany({});

  await new Usuario(testUser).save();
});

describe("/login", () => {
  test("Devuelve status 200", async () => {
    await api.post("/login").send(userData).expect(200);
  });
  test("Si el usuario no existe devuelve 401", async () => {
    await api.post("/login").send(userNotExistsData).expect(401);
  });
  test("Devuelve el token correcto asociado al usuario", async () => {
    const userId = await userServices.getUserId();

    const response = await api.post("/login").send(userData).expect(200);

    const { token } = response.body;

    const userIdFromToken = getUserFromJwt(token);

    expect(userIdFromToken).toBe(userId.toString());
  });
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
