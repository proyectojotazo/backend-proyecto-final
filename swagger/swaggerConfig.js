const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "El último y me voy - API",
      version: "1.0.0",
    },
  },
  apis: [`${path.join(__dirname, "../routes/*.js")}`],
};

const swaggerDocs = swaggerJsDoc(swaggerSpec);

module.exports = { swaggerDocs, swaggerOptions };
