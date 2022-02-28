const { Usuario, Articulo } = require("../models");
const { getUserFromJwt, CAMPOS } = require("../utils");
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

userController.followUsuario = async (req, res, next) => {
  try {
    // Comprueba si es un mail
    const isMail = CAMPOS.email.reg.test(req.params.user);

    // El usuario al que se seguira
    const usuarioDestino = isMail
      ? await Usuario.findOne({ email: req.params.user })
      : await Usuario.findOne({
          nickname: req.params.user,
        });

    if (!usuarioDestino) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Usuario no encontrado",
      };
      return next(error);
    }

    const userIdDestino = usuarioDestino._id.toString();

    // El usuario propietario que sigue a otro
    const tokenUser = req.get("Authorization").split(" ")[1];
    const userIdRemitente = getUserFromJwt(tokenUser);

    const usuarioRemitente = await Usuario.findById(userIdRemitente);

    // No permitir seguise a uno mismo
    if (userIdDestino === userIdRemitente) {
      const error = {
        name: "Cant follow your self",
        status: 404,
        message: "No puedes seguirte a ti mismo",
      };
      return next(error);
    }

    // No permitir seguir el usuario más de una vez
    if (usuarioDestino.usuarios.seguidores.includes(userIdRemitente)) {
      const error = {
        name: "Already followed",
        status: 404,
        message: "Ya sigues a ese usuario",
      };
      return next(error);
    }

    // Datos a actualizar
    const dataToDestino = {
      usuarios: {
        seguidores: [...usuarioDestino.usuarios.seguidores, userIdRemitente],
        seguidos: [...usuarioDestino.usuarios.seguidos],
      },
    };

    const dataToRemitente = {
      usuarios: {
        seguidos: [...usuarioRemitente.usuarios.seguidos, userIdDestino],
        seguidores: [...usuarioRemitente.usuarios.seguidores],
      },
    };

    // Actualizamos el usuario remitente y añadimos que sigue a esa persona
    await usuarioRemitente.actualizaUsuario(dataToRemitente);

    // Actualizamos el usuario destino y le añadimos el seguidor que le sigue
    await usuarioDestino.actualizaUsuario(dataToDestino);

    return res.status(200).json({
      Message: `El usuario ${usuarioRemitente.nickname} ahora sigue a ${usuarioDestino.nickname}`,
    });
  } catch (error) {
    return next(error);
  }
};

userController.unfollowUsuario = async (req, res, next) => {
  try {
    // Comprueba si es un mail
    const isMail = CAMPOS.email.reg.test(req.params.user);

    // El usuario al que se dejara de seguir
    const usuarioDestino = isMail
      ? await Usuario.findOne({ email: req.params.user })
      : await Usuario.findOne({
          nickname: req.params.user,
        });

    if (!usuarioDestino) {
      const error = {
        name: "NotFound",
        status: 404,
        message: "Usuario no encontrado",
      };
      return next(error);
    }

    const userIdDestino = usuarioDestino._id.toString();

    // El usuario propietario que deja de seguir a otro
    const tokenUser = req.get("Authorization").split(" ")[1];
    const userIdRemitente = getUserFromJwt(tokenUser);

    const usuarioRemitente = await Usuario.findById(userIdRemitente);

    // No se permite dejar de seguirse a uno mismo
    if (userIdDestino === userIdRemitente) {
      const error = {
        name: "Cant unfollow your self",
        status: 404,
        message: "No puedes dejar de seguirte a ti mismo",
      };
      return next(error);
    }

    // No puedes dejar de seguir a alguien que no sigues
    if (!usuarioDestino.usuarios.seguidores.includes(userIdRemitente)) {
      const error = {
        name: "Cant be unfollowed",
        status: 404,
        message: "No puedes dejar de seguir a ese usuario porque no le sigues",
      };
      return next(error);
    }

    const dataToDestino = {
      usuarios: {
        seguidores: usuarioDestino.usuarios.seguidores.filter(
          (user) => user.toString() !== userIdRemitente
        ),
        seguidos: [...usuarioDestino.usuarios.seguidos],
      },
    };

    const dataToRemitente = {
      usuarios: {
        seguidos: usuarioRemitente.usuarios.seguidos.filter(
          (user) => user.toString() !== userIdDestino
        ),
        seguidores: [...usuarioRemitente.usuarios.seguidores],
      },
    };

    // Actualizamos el usuario remitente y le borramos la persona que ha dejado de seguir a esa persona
    await usuarioRemitente.actualizaUsuario(dataToRemitente);

    // Actualizamos el usuario destino y le borramos que la persona lo ha dejado de seguir
    await usuarioDestino.actualizaUsuario(dataToDestino);

    return res.status(200).json({
      Message: `El usuario ${usuarioRemitente.nickname} ha dejado de seguir a ${usuarioDestino.nickname}`,
    });
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
