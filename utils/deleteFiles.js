const { unlink, rm, access } = require("fs");

// Eliminar archivo del artículo en la ruta del usuario
const deleteFileOfPath = (path) => {
  const splitPath = path.split("\\");
  const splitFile = splitPath[3].split("_");
  const userId = splitPath[2];
  const dateId = splitFile[1].split(".")[0];
  const extFile = splitFile[1].split(".")[1];

  const deleteFilePath = `./public/upload/${userId}/archivoDestacado_${dateId}.${extFile}`;

  try {
    unlink(deleteFilePath, (err) => {
      if (err) throw err;
      console.log(`${dateId} ha sido eliminado`);
    });
  } catch (error) {
    console.log("Error eliminar archivo: ", error);
  }
};

// Eliminar carpeta del usuario
const deleteFolderUser = (userId) => {
  const deleteFolderPath = `./public/upload/${userId}/`;
  try {
    access(deleteFolderPath, function (error) {
      if (!error) {
        console.log("Directorio existe");
        rm(deleteFolderPath, { recursive: true, force: true }, (err) => {
          if (err) throw err;
          console.log(`Directorio de ${userId} ha sido eliminado`);
        });
      } else {
        console.log("No hay directorio de usuario para eliminar");
      }
    });
  } catch (error) {
    console.log("Error al eliminar directorio: ", error);
  }
};

module.exports = { deleteFileOfPath, deleteFolderUser };
