const {
  createUserDir,
  deleteUserDir,
  deleteFile,
  readDir,
} = require("../services/fileHandlerServices");
const path = require("path");

// const rndNum = Math.floor(Math.random() * 1000000).toString();

// createUserDir("123");

// deleteFile('public/upload/123/myfile.jpg')

// // deleteUserDir('123')

const deleteAllFoldersInUpload = async () => {
  const folders = await readDir(path.join(__dirname, "../public/upload"));
  for (const folder of folders) {
    await deleteUserDir(folder);
  }
};

deleteAllFoldersInUpload();
