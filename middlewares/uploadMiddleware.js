const { multer, upload } = require('../lib/multerConfig');

const uploadMiddleware = (nameFile) => (req, res, next) => {
    console.log(nameFile);
    const uploader = upload.single(nameFile);
    return uploader(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            next(err);
        } else if (err) {
            err.custom = 'Error en uploader';
            // const error = {
            //   ...err,
            //   name: "FileError",
            //   message: err.message,
            //   status: 400,
            // };
            next(err);
        }
        next();
    });
};

module.exports = uploadMiddleware;
