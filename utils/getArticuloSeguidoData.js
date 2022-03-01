const getArticuloSeguidoData = (idArticle, user) => {
  const isFavourite = user.articulos.favoritos.includes(idArticle);

  const articuloFavorito = {
    articulos: {
      ...user.articulos,
      favoritos: isFavourite
        ? user.articulos.favoritos.filter(
            (arId) => arId.toString() !== idArticle.toString()
          )
        : [...user.articulos.favoritos, idArticle],
    },
  };

  return articuloFavorito;
};

module.exports = getArticuloSeguidoData;
