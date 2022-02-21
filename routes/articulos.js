const articulosRouter = require("express").Router();

const { articulosController } = require("../controllers");

const { jwtAuth } = require("../middlewares");

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: apiKey
 *          name: Authorization
 *          in: header
 *  schemas:
 *      Articles:
 *          type: object
 *          properties:
 *              titulo:
 *                  type: string
 *                  description: Nombre del artículo
 *              archivoDestacado:
 *                  type: string
 *                  description: Video o imagen opcional
 *              textoIntroductorio:
 *                  type: string
 *                  description: Texto de introducción
 *              contenido:
 *                  type: string
 *                  description: Contenido del artículo
 *              fechaPublicacion:
 *                  type: date
 *                  description: Fecha de publicación
 *              estado:
 *                  type: string
 *                  description: Borrador o Publicado
 *              categorias:
 *                  type: [string]
 *                  description: Categorías
 *              usuario:
 *                  type: string
 *                  description: ID del usuario creador
 *              comentarios:
 *                  type: [string]
 *                  description: Comentarios del artículo
 *          required:
 *              - titulo
 *              - textoIntroductorio
 *              - contenido
 *              - fechaPublicacion
 *          example:
 *              titulo: Título artículo de prueba
 *              textoIntroductorio: Esto es un artículo de prueba
 *              contenido: Contenido del artículo de prueba
 *              fechaPublicacion: 2022-02-21T08:22:31.120Z
 */

/* GET */
/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Muestra todos los artículos
 *     tags: [Artículos]
 *     description: Devuelve todos los artículos
 *     responses:
 *       200:
 *         description: Muestra todos los artículos
 */
articulosRouter.get("/", articulosController.getArticulos);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Muestra un artículo
 *     tags: [Artículos]
 *     description: Devuelve un artículo por id
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *       302:
 *         description: Muestra un artículo por id
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#components/schemas/Articles'
 */
articulosRouter.get("/:id", articulosController.getArticulo);

/* PATCH */
articulosRouter.patch("/:id", jwtAuth, articulosController.actualizarArticulo);

/* DELETE */
articulosRouter.delete("/:id", jwtAuth, articulosController.borraArticulo);

/* POST */
/**
 * @swagger
 * /articles:
 *   post:
 *     security:
 *          - bearerAuth: []
 *     summary: Crea un nuevo artículo
 *     tags: [Artículos]
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Articles'
 *     responses:
 *          201:
 *              description: Nuevo artículo creado!
 */
articulosRouter.post("/", jwtAuth, articulosController.creaArticulo);

module.exports = articulosRouter;
