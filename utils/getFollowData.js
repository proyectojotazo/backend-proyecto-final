const getFollowData = (usuarioDestino, usuarioRemitente) => {
  const userIdRemitente = usuarioRemitente._id;
  const userIdDestino = usuarioDestino._id;

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

  return { dataToDestino, dataToRemitente };
};

module.exports = getFollowData;
