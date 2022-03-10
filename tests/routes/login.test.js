const {
  api,
  user,
  apiServices,
  userServices,
  deleteAllFoldersInUpload,
  closeConnection,
} = require("./helpers");

beforeEach(async () => {
  await userServices.deleteAllUsers();
});

describe("/login", () => {
  test("Devuelve status 200", async () => {
    // Registramos al usuario que luego logearemos
    await apiServices.registerUser(user);

    // Loguearemos al usuario que hemos creado
    await api.post("/login").send(user).expect(200);
  });
  test("Si el usuario no existe devuelve 401", async () => {
    // Intentamos loguear al usuario sin registrarlo antes
    await api.post("/login").send(user).expect(401);
  });
  test("Devuelve el token correcto asociado al usuario", async () => {
    // Registramos al usuario que luego logearemos
    await apiServices.registerUser(user);

    const response = await api.post("/login").send(user).expect(200);

    const { token } = response.body;

    expect(token).toBeDefined();
  });
  test("Cambia el estado online a true", async () => {
    // Registramos al usuario que luego logearemos
    await apiServices.registerUser(user);

    // Loguearemos al usuario que hemos creado
    await api.post("/login").send(user).expect(200);

    const userLogged = await userServices.getUserByName(user.nombre);

    expect(userLogged.online).toBe(true);
  });
});

afterAll(async () => {
  await deleteAllFoldersInUpload();
  closeConnection();
});
