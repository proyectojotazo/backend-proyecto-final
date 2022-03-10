const {
  api,
  user,
  userServices,
  deleteAllFoldersInUpload,
  closeConnection
} = require("./helpers");

const userWrongFields = {
  nombre: "Wr2ong",
  apellidos: "wrongUser",
  email: "wrong@gmail.com",
  nickname: "wrongMan",
  password: "1234Abcd-",
  articulos: { creados: [], favoritos: [] },
  usuarios: { seguidos: [], seguidores: [] },
};

beforeEach(async () => {
  await userServices.deleteAllUsers()
});

describe("/register", () => {
  test("Debe registrar un usuario correctamente", async () => {
    // Obtenemos los usuarios de mongo antes del registro
    const usersBeforeRegister = await userServices.getUsers();

    // Realizamos la petición de registro de nuevo usuario
    await api.post("/register").send(user).expect(201);

    // Obtenemos los usuarios de mongo después del registro
    const usersAfterRegister = await userServices.getUsers();

    expect(usersAfterRegister).toHaveLength(usersBeforeRegister.length + 1);
  });

  test("Debe devolver error 400 con campos invalidos", async () => {
    await api
      .post("/register")
      .send(userWrongFields)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Debe devolver error 400 con campos unicos", async () => {
    // Realizamos el registro del primer usuario
    await api.post("/register").send(user).expect(201);

    // Volvemos a registrar al mismo usuario
    await api
      .post("/register")
      .send(user)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(async () => {
  await deleteAllFoldersInUpload();
  closeConnection()
});
