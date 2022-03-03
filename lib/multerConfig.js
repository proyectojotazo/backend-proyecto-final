const multer = require("multer");
const path = require("path");
const { access, mkdir } = require("fs");
const { getUserFromJwt } = require("../utils");

// Obtener ID de usuario
const userId = (req) => {
  if (req.get("Authorization")) {
    const jwtToken = req.get("Authorization").split(" ")[1];
    return getUserFromJwt(jwtToken).toString();
  }
};

// Configuración del almacenamiento
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = "./public/upload/" + userId(req);
    access(dest, function (error) {
      if (error) {
        console.log("Directorio no existe");
        return mkdir(dest, { recursive: true }, (err) => cb(err, dest));
      } else {
        console.log("Directorio existe.");
        return cb(null, dest);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Límite de tamaño del archivo subido
const limitSize = {
  fileSize: 10000000, // 10000000 Bytes = 10MB
};

// Filtro de archivos
const filesFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg|gif|mp4|mpeg-4|mkv)$/)) {
    return cb(
      new Error(
        "Sólo se admiten imágenes o vídeos tipo: jpg, jpeg, png, gif, mp4, mpeg-4 o mkv"
      )
    );
  }
  cb(null, true);
};

// Configuración para el upload de multer
const upload = multer({
  storage: fileStorage,
  limits: limitSize,
  fileFilter: filesFilter,
});

module.exports = upload;
