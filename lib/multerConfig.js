const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: "./public/upload-files",
  //         (req, file, cb) => {
  //     cb(null, "./public/upload-files");
  //   },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // cb(null, file.originalname);
  },
});

const limit = {
  fileSize: 2000000, // 2000000 Bytes = 2MB
};

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
    return cb(new Error("Sólo se admiten imágenes tipo: jpg, jpeg, png y gif"));
  }
  cb(null, true);
};

const upload = multer({
  storage: imageStorage,
  limits: limit,
  fileFilter: imageFilter,
});

module.exports = upload;
