const cron = require('node-cron');
const { Articulo } = require('../models');

// Cada hora va a comprobar si hay algun post que pueda publicarse
function postProgramados() {
  // Se va a ejecutar la funcion al minuto 59 de cada hora
  // 21:59h, 22:59h, 23:59h...
  cron.schedule('0 59 * * * *', () => {
    console.log('Comprobando si hay post nuevos');
    Articulo.find({ estado: 'Borrador' }).then((data) => {
      data.forEach((articulo) => {
        if (Date.now() > articulo.fechaPublicacion.getTime()) {
          const id = articulo._id.toString();
          const newState = { estado: 'Publicado' };

          Articulo.findByIdAndUpdate(id, newState)
            .then((data) =>
              console.log('Se ha publicado el articulo programado:', id)
            )
            .catch((error) => console.log(error));
        }
      });
    });
  });
}

module.exports = postProgramados;
