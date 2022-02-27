const { Usuario, Articulo } = require("../models");
const { getUserFromJwt } = require("../utils");
const { deleteFolderUser } = require("../utils/deleteFiles");

const userController = {};

userController.getUsuario = async (req, res, next) => {
  const { nickname } = req.params;

  try {
    const usuario = await Usuario.findOnePopulated(nickname);

    // Si no se encuentra el usuario
    if (!usuario) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Usuario no encontrado",
      };
      return next(error);
    }
    return res.status(302).json({ usuario });
  } catch (error) {
    return next(error);
  }
};

userController.updateUsuario = async (req, res, next) => {
  // obtenemos id del usuario a actualizar
  const { id } = req.params;

  // datos a actualizar
  const datosActualizar = req.body;

  try {
    // buscamos al usuario
    const usuario = await Usuario.findById(id);

    await usuario.actualizaUsuario(datosActualizar);

    // Al no enviar información simplemente enviaremos .end()
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

userController.borrarUsuario = async (req, res, next) => {
  // obtendremos el id
  const { id } = req.params;

  try {
    // buscamos al usuario
    const usuario = await Usuario.findById(id);

    await Usuario.deleteAllData(usuario);

    deleteFolderUser(id);

    // Al no enviar información simplemente enviaremos .end()
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

// ToCheck: Porque buscar por mail o nickname y no por ID

userController.followUsuario = async (req, res, next) => {
  console.log("entro controller");
  try {
    const { id: userIdDestino } = req.params;
    const usuarioDestino = await Usuario.findById(userIdDestino);
    const tokenUser = req.get("Authorization").split(" ")[1];
    const userIdRemitente = getUserFromJwt(tokenUser);

    const usuarioRemitente = await Usuario.findById(userIdRemitente);

    // No permitir seguise a uno mismo
    // ToCheck: ¿Como se daría éste caso?
    // if (userIdDestino === userIdRemitente) {
    //   const error = {
    //     name: "Cant follow your self",
    //     status: 404,
    //     message: "No puedes seguirte a ti mismo",
    //   };
    //   return next(error);
    // }

    const isFollowing =
      usuarioDestino.usuarios.seguidores.includes(userIdRemitente);

    const dataToDestino = {
      usuarios: {
        ...usuarioDestino.usuarios,
        seguidores: isFollowing
          ? usuarioDestino.usuarios.seguidores.filter(
              (userId) => userId.toString() !== userIdRemitente.toString()
            )
          : [...usuarioDestino.usuarios.seguidores, userIdRemitente],
      },
    };
    const dataToRemitente = {
      usuarios: {
        ...usuarioRemitente.usuarios,
        seguidos: isFollowing
          ? usuarioRemitente.usuarios.seguidores.filter(
              (userId) => userId.toString() !== userIdDestino.toString()
            )
          : [...usuarioRemitente.usuarios.seguidores, userIdDestino],
      },
    };

    // Actualizamos el usuario remitente y añadimos que sigue a esa persona
    await usuarioRemitente.actualizaUsuario(dataToRemitente);

    // Actualizamos el usuario destino y le añadimos el seguidor que le sigue
    await usuarioDestino.actualizaUsuario(dataToDestino);

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

userController.articulosfavorito = async (req, res, next) => {
  try {
    // obtenemos el id
    const { id } = req.params;
    // buscamos el articulo
    const articulo = await Articulo.findById(id);

    if (!articulo) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Articulo no encontrado",
      };
      return next(error);
    }

    // obtener id de usuario del token
    const tokenUser = req.get("Authorization").split(" ")[1];
    const usuario = await Usuario.findOne({ _id: getUserFromJwt(tokenUser) });
    // vemos si el articulos existe en favoritos
    const articuloseguido = async () => {
      if (usuario.articulos.favoritos.includes()) {
        const result = usuario.articulos.favoritos.filter(
          (ar) => ar.toString() !== articulo._id.toString()
        );
        const articulofavorito = {
          articulos: {
            creados: [...usuario.articulos.creados],
            favoritos: [...result],
          },
        };
        await usuario.actualizaUsuario(articulofavorito);
        return res.status(200).json({
          Message: `Has dejado de seguir el articulo ${articulo.titulo}`,
        });
      } else {
        const articulofavorito = {
          articulos: {
            creados: [...usuario.articulos.creados],
            favoritos: [...usuario.articulos.favoritos, id],
          },
        };
        await usuario.actualizaUsuario(articulofavorito);
        return res.status(200).json({
          Message: `Has añadido a favoritos el articulo ${articulo.titulo}`,
        });
      }
    };

    articuloseguido();
  } catch (error) {
    return next(error);
  }
};

module.exports = userController;
