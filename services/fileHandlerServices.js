const fspromises = require("fs/promises");
const path = require("path");

const rootPath = path.join(__dirname, "../public");

const createUserDir = async (userId) => {
  const dest = path.join(rootPath, `/upload/${userId}`);

  try {
    await fspromises.mkdir(dest);
  } catch (error) {
    // Si el directorio existe genera un error
    console.error(error.message);
  }
};

const folderExists = async (pathToFolder) => {
  // Obtenemos la ruta hasta el directorio donde se encuentra el archivo
  const folderToCheck = path.join(pathToFolder, "../");

  try {
    // Comprobamos si existe
    await fspromises.access(folderToCheck);
  } catch (error) {
    // La carpeta no existe
    console.error(error);
  }
};

const fileExists = async (pathToFile) => {
  // Obtenemos el archivo a comprobar si existe
  const fileToCheck = pathToFile.split("\\").slice(-1).join("");

  try {
    // Comprobamos si existe dicho archivo
    await fspromises.access(pathToFile);
  } catch (error) {
    // Si no existe lanzamos un error
    console.log(`El archivo ${fileToCheck} no existe`);
    // error.message = `El archivo ${fileToCheck} no existe`;
    throw error;
  }
};

const deleteFile = async (filePath) => {
  console.log(filePath)
  const pathFileToDelete = path.join(rootPath, "/", filePath);
  await folderExists(pathFileToDelete);
  await fileExists(pathFileToDelete);
  try {
    await fspromises.unlink(pathFileToDelete);
  } catch (error) {
    console.error(error);
  }
};

const deleteUserDir = async (userId) => {
  const userFolder = path.join(rootPath, `/upload/${userId}`);
  try {
    await fspromises.rm(userFolder, { recursive: true });
  } catch (error) {
    console.error(error);
  }
};

const readDir = async (pathDirToRead) => {
  try {
    const files = await fspromises.readdir(pathDirToRead);
    return files.filter((folder) => !folder.endsWith(".jpg"));
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createUserDir,
  deleteFile,
  deleteUserDir,
  readDir,
};
