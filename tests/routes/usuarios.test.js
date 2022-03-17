const {
  api,
  user,
  userTwo,
  articleWithImage,
  apiServices,
  articlesServices,
  userServices,
  deleteAllFoldersInUpload,
  closeConnection,
} = require("./helpers");

beforeEach(async () => {
  await userServices.deleteAllUsers();
  await articlesServices.deleteAllArticles();
});

describe("/users", () => {
  describe("GET /:nickname", () => {
    test("devuelve 302 (Found)", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario
      await apiServices.loginUser(user);
      // Obtener el nick de usuario
      const { nickname } = user;

      await api
        .get(`/users/${nickname.toLowerCase()}`)
        .expect(302)
        .expect("Content-Type", /application\/json/);
    });
    test("devuelve el usuario correcto", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario
      await apiServices.loginUser(user);
      // Obtener el nick de usuario
      const { nickname } = user;

      const response = await api
        .get(`/users/${nickname.toLowerCase()}`)
        .expect(302);

      const usuarioDevuelto = response.body;

      expect(usuarioDevuelto.nombre).toBe(user.nombre);
    });
    test("devuelve error 404 con nickname inexistente", async () => {
      await api
        .get("/users/calabuig")
        .expect(404)
        .expect("Content-Type", /application\/json/);
    });
  });
  describe("PATCH /:id", () => {
    // Actualiza correctamente
    test("Actualiza nombre correctamente", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);
      // Obtenemos el id del usuario a actualizar
      const userId = await userServices.getUserId(user);
      // Obtenemos el usuario antes de cambiar el nombre
      const userBeforeUpdate = await userServices.getUserByName(user.nombre);
      // Generamos el campo a actualizar
      const fieldToUpdate = { nombre: "Actualizado" };
      // Hacemos la peticion 'PATCH'
      await api
        .patch(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("nombre", fieldToUpdate.nombre)
        .expect(204);
      // Obtenemos el usuario que ha sido actualizado
      const userUpdated = await userServices.getUserByName(
        fieldToUpdate.nombre
      );

      expect(userUpdated.nombre).toBe(fieldToUpdate.nombre);
      expect(userUpdated.nombre).not.toBe(userBeforeUpdate.nombre);
    });
    test("Actualiza password correctamente", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);
      // Obtenemos el id del usuario a actualizar
      const userId = await userServices.getUserId(user);
      // Generamos el campo a actualizar
      const fieldToUpdate = {
        password: "1234-Abcd",
      };

      await api
        .patch(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("password", fieldToUpdate.password)
        .expect(204);

      // Obtenemos el usuario que ha sido actualizado
      const userUpdated = await userServices.getUserByName(user.nombre);

      // Comprobamos que la contraseña se haya modificado correctamente
      const isHashed = await userUpdated.comparePassword(
        fieldToUpdate.password
      );

      expect(isHashed).toBe(true);
    });
    test("Si no se pasa token devuelve 401", async () => {
      const idNotExists = "621600f9a5e09ea330bdc4a6";
      await api
        .patch(`/users/${idNotExists}`)
        .set("Authorization", `Bearer `)
        .expect(401);
    });
    test("Si la id no existe devuelve 404 (NotFound)", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);

      const idNotExists = "621600f9a5e09ea330bdc4a6";

      await api
        .patch(`/users/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    test("Si la id del token es diferente de la id del usuario a actualizar devuelve 401", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);
      // Registramos otro usuario
      await apiServices.registerUser(userTwo);
      // Obtenemos la id del segundo usuario
      const otherUserId = await userServices.getUserId(userTwo);
      await api
        .patch(`/users/${otherUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
      // Debe devolver 401
    });
  });
  describe("DELETE /:id", () => {
    test("Borra un usuario correctamente", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);
      // Obtenemos la id del usuario a eliminar
      const id = await userServices.getUserId(user);
      // Obtenemos todos los usuarios actuales
      const usersBeforeDelete = await userServices.getUsers();

      await api
        .delete(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      // Obtenemos todos los usuarios tras el borrado del usuario
      const usersAfterDelete = await userServices.getUsers();

      expect(usersAfterDelete.length).toBe(usersBeforeDelete.length - 1);
    });
    test("Si no se pasa token devuelve 401", async () => {
      const idNotExists = "621600f9a5e09ea330bdc4a6";
      await api
        .delete(`/users/${idNotExists}`)
        .set("Authorization", `Bearer `)
        .expect(401);
    });
    test("Si no encuentra al usuario devuelve 404", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);

      const idNotExists = "6214b593b6c1fa7fee58f955";

      await api
        .delete(`/users/${idNotExists}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
    test("Si la id del token es diferente de la id del usuario a borrar devuelve 401", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);
      // Registramos otro usuario
      await apiServices.registerUser(userTwo);
      // Obtenemos la id del segundo usuario
      const otherUserId = await userServices.getUserId(userTwo);

      await api
        .patch(`/users/${otherUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
      // Debe devolver 401
    });
    test("Si se borra al usuario todos sus articulos se deben borrar", async () => {
      // Registrar usuario
      await apiServices.registerUser(user);
      // Loguear usuario y obtenemos el token
      const token = await apiServices.loginUser(user);
      // Crear un articulo con el usuario
      await apiServices.createArticleWithImage(token, articleWithImage);
      // Comprobar que tanto el usuario como el articulo existen
      const userToDelete = await userServices.getUserByName(user.nombre);
      expect(userToDelete).toBeDefined();
      const articleCreated = await articlesServices.getArticleById(
        userToDelete.articulos.creados[0]
      );
      expect(articleCreated).toBeDefined();
      // Eliminar al usuario
      await api
        .delete(`/users/${userToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
      // Comprobar que el usuario y el articulo creado no existen
      const userDeleted = await userServices.getUserByName(user.nombre);
      expect(userDeleted).toBeNull();
      const articleUserDeleted = await articlesServices.getArticleById(
        userToDelete.articulos.creados[0]
      );
      expect(articleUserDeleted).toBeNull();
    });
    test("Si se borra al usuario debe eliminarse de los usuarios seguidores", async () => {
      // Registrar 2 usuarios
      await apiServices.registerUser(user);
      await apiServices.registerUser(userTwo);
      // Loguear 1 de ellos para seguir al otro
      const tokenSeguidor = await apiServices.loginUser(userTwo);
      // Obtener id del usuario a seguir
      const idUsuarioAseguir = await userServices.getUserId(user);
      // Seguir al usuario
      await apiServices.followUser(idUsuarioAseguir, tokenSeguidor);

      // Borrar al usuario seguido
      const tokenUsuarioSeguido = await apiServices.loginUser(user);
      await apiServices.deleteUser(idUsuarioAseguir, tokenUsuarioSeguido);

      // Comprobamos que el usuario seguidor ya no tiene la id del usuario borrado
      const userSeguidor = await userServices.getUserByName(userTwo.nombre);
      expect(userSeguidor.usuarios.seguidos.length).toBe(0);
    });
  });
  describe("POST /follow/:id", () => {
    test("Un usuario sigue a otro correctamente", async () => {
      // Registrar 2 usuarios
      await apiServices.registerUser(user);
      await apiServices.registerUser(userTwo);
      // Loguear 1 de ellos para seguir al otro
      const tokenSeguidor = await apiServices.loginUser(userTwo);
      // Obtener id del usuario a seguir
      const idUsuarioAseguir = await userServices.getUserId(user);
      // Seguir al usuario
      await apiServices.followUser(idUsuarioAseguir, tokenSeguidor);

      // Comprobar que el seguidor tiene la id del usuario al que sigue
      const userSeguidor = await userServices.getUserByName(userTwo.nombre);
      expect(userSeguidor.usuarios.seguidos.includes(idUsuarioAseguir)).toBe(
        true
      );
      expect(userSeguidor.usuarios.seguidos.length).toBe(1);

      // Comprobar que el seguido tiene la id del usuario que le sigue
      const userSeguido = await userServices.getUserByName(user.nombre);
      expect(userSeguido.usuarios.seguidores.includes(userSeguidor.id)).toBe(
        true
      );
    });
    test("Un usuario deja de seguir a otro correctamente", async () => {
      // Registrar 2 usuarios
      await apiServices.registerUser(user);
      await apiServices.registerUser(userTwo);
      // Loguear 1 de ellos para seguir al otro
      const tokenSeguidor = await apiServices.loginUser(userTwo);
      // Obtener id del usuario a seguir
      const idUsuarioAseguir = await userServices.getUserId(user);
      // Seguir al usuario
      await apiServices.followUser(idUsuarioAseguir, tokenSeguidor);
      // Volviendo a hacer la peticion, dejamos de seguir al usuario
      await apiServices.followUser(idUsuarioAseguir, tokenSeguidor);

      // Comprobamos que el usuario seguidor ya no tiene la id del usuario que seguia
      const userSeguidor = await userServices.getUserByName(userTwo.nombre);
      expect(userSeguidor.usuarios.seguidos.length).toBe(0);
      expect(
        userSeguidor.usuarios.seguidores.includes(idUsuarioAseguir.id)
      ).toBe(false);

      // Comrpobamos que el usuario seguido ya no tiene la id del usuario seguidor
      const userSeguido = await userServices.getUserByName(user.nombre);
      expect(userSeguido.usuarios.seguidores.length).toBe(0);
      expect(userSeguido.usuarios.seguidores.includes(userSeguidor.id)).toBe(
        false
      );
    });
  });
  describe("POST /articles/favourites/:id", () => {
    test("Debe agregar un articulo a favoritos correctamente", async () => {
      // Registrar 2 usuarios
      await apiServices.registerUser(user);
      await apiServices.registerUser(userTwo);
      // Loguear al usuario creador del articulo
      const tokenCreadorAnuncio = await apiServices.loginUser(user);
      // Loguear al usuario que agregará el articulo a favoritos
      const tokenUsuarioAgregador = await apiServices.loginUser(userTwo);

      // Crear el articulo
      await apiServices.createArticleWithImage(
        tokenCreadorAnuncio,
        articleWithImage
      );

      // Obtener el id del anuncio a agregar
      const articuloCreado = await articlesServices.getArticleByTitle(
        articleWithImage.titulo
      );

      // Agregar el articulo a favoritos
      await api
        .post(`/users/articles/favourites/${articuloCreado.id}`)
        .set("Authorization", `Bearer ${tokenUsuarioAgregador}`)
        .expect(204);

      // Comprobar que el usuario tiene el articulo agregado a favoritos
      const usuarioAgregador = await userServices.getUserByName(userTwo.nombre);
      expect(
        usuarioAgregador.articulos.favoritos.includes(articuloCreado.id)
      ).toBe(true);
    });
    test("Debe quitar un articulo de favoritos correctamente", async () => {
      // Registrar 2 usuarios
      await apiServices.registerUser(user);
      await apiServices.registerUser(userTwo);
      // Loguear al usuario creador del articulo
      const tokenCreadorAnuncio = await apiServices.loginUser(user);
      // Loguear al usuario que agregará el articulo a favoritos
      const tokenUsuarioAgregador = await apiServices.loginUser(userTwo);

      // Crear el articulo
      await apiServices.createArticleWithImage(
        tokenCreadorAnuncio,
        articleWithImage
      );

      // Obtener el id del anuncio a agregar
      const articuloCreado = await articlesServices.getArticleByTitle(
        articleWithImage.titulo
      );

      // Agregar el articulo a favoritos
      await api
        .post(`/users/articles/favourites/${articuloCreado.id}`)
        .set("Authorization", `Bearer ${tokenUsuarioAgregador}`)
        .expect(204);

      // Volviendo a hacer la peticion, quitamos el articulo de favoritos
      await api
        .post(`/users/articles/favourites/${articuloCreado.id}`)
        .set("Authorization", `Bearer ${tokenUsuarioAgregador}`)
        .expect(204);

      // Comprobamos que no tiene la id del articulo
      const usuarioAgregador = await userServices.getUserByName(userTwo.nombre);
      expect(
        usuarioAgregador.articulos.favoritos.includes(articuloCreado.id)
      ).toBe(false);
    });
  });
});

afterAll(async () => {
  await deleteAllFoldersInUpload();
  closeConnection();
});
