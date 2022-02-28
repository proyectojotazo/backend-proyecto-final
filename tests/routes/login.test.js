const mongoose = require("mongoose");

const { server } = require("../../app");

const { Usuario } = require("../../models");

const { testUser, testUser2, userServices, api } = require("../helpers");

const { getUserFromJwt } = require("../../utils");

beforeEach(async () => {
  await Usuario.deleteMany({});

  await new Usuario(testUser).save();
});

describe("/login", () => {
  test("Devuelve status 200", async () => {
    await api.post("/login").send(testUser).expect(200);
  });
  test("Si el usuario no existe devuelve 401", async () => {
    await api.post("/login").send(testUser2).expect(401);
  });
  test("Devuelve el token correcto asociado al usuario", async () => {
    const userId = await userServices.getUserId(testUser);

    const response = await api.post("/login").send(testUser).expect(200);

    const { token } = response.body;

    const userIdFromToken = getUserFromJwt(token);

    expect(userIdFromToken).toBe(userId.toString());
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
