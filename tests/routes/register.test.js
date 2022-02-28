const supertest = require("supertest");
const mongoose = require("mongoose");

const { Usuario } = require("../../models");

const { app, server } = require("../../app");

const { testUser, testUser2, ERRORS } = require("../helpers");

const api = supertest(app);

const userWrongFields = {
  nombre: "Wr2ong",
  apellidos: "wrongUser",
  email: "wrong@gmail.com",
  nickname: "wrongMan",
  password: "1234Abcd-",
  articulos: { creados: [], favoritos: [] },
  usuarios: { seguidos: [], seguidores: [] },
};

const userRepeatedFields = {
  ...testUser,
};

beforeEach(async () => {
  await Usuario.deleteMany({});

  await new Usuario(testUser).save();
});

describe("/register", () => {
  test("Debe registrar un usuario correctamente", async () => {
    const usersBeforeRegister = await Usuario.find();
    await api.post("/register").send(testUser2).expect(201);
    const usersAfterRegister = await Usuario.find();

    const userRegistered = await Usuario.findOne({ name: testUser2.name });

    expect(usersAfterRegister).toHaveLength(usersBeforeRegister.length + 1);
    expect(usersAfterRegister).toContainEqual(userRegistered);
  });

  test("Debe devolver error 400 con campos invalidos", async () => {
    const response = await api
      .post("/register")
      .send(userWrongFields)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const errName = response.body.name;

    expect(errName).toBe(ERRORS[errName]);
  });

  test("Debe devolver error 400 con campos unicos", async () => {
    const response = await api
      .post("/register")
      .send(userRepeatedFields)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const errName = response.body.name;

    expect(errName).toBe(ERRORS[errName]);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
