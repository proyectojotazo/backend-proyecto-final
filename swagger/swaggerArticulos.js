/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  schemas:
 *      Articles:
 *          type: object
 *          properties:
 *              titulo:
 *                  type: string
 *                  description: Nombre del artículo
 *              archivoDestacado:
 *                  type: string
 *                  format: binary
 *                  description: Video o imagen opcional
 *              textoIntroductorio:
 *                  type: string
 *                  description: Texto de introducción
 *              contenido:
 *                  type: string
 *                  description: Contenido del artículo
 *              fechaPublicacion:
 *                  type: string
 *                  description: Fecha de publicación
 *              estado:
 *                  type: string
 *                  description: Borrador o Publicado
 *              categorias:
 *                  type: array
 *                  description: Categorías
 *          required:
 *              - titulo
 *              - textoIntroductorio
 *              - contenido
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

/* PATCH */
/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     security:
 *          - bearerAuth: []
 *     summary: Actualiza artículo
 *     tags: [Artículos]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *     requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          titulo:
 *                              type: string
 *                              description: Nombre del artículo
 *                          archivoDestacado:
 *                              type: string
 *                              description: Video o imagen opcional
 *                          textoIntroductorio:
 *                              type: string
 *                              description: Texto de introducción
 *                          contenido:
 *                              type: string
 *                              description: Contenido del artículo
 *                          fechaPublicacion:
 *                              type: string
 *                              description: Fecha de publicación
 *                          estado:
 *                              type: string
 *                              description: Borrador o Publicado
 *                          categorias:
 *                              type: array
 *                              description: Categorías
 *     responses:
 *          200:
 *              description: Artículo actualizado!
 */

/* DELETE */
/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     security:
 *          - bearerAuth: []
 *     summary: Elimina un artículo
 *     tags: [Artículos]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *          200:
 *              description: Artículo eliminado!
 */

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
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Articles'
 *     responses:
 *          201:
 *              description: Nuevo artículo creado!
 */

/**
 * @swagger
 * /articles/response/{idArticulo}:
 *   post:
 *     security:
 *          - bearerAuth: []
 *     summary: Crea un nuevo artículo en respuesta a otro artículo
 *     description: Crea un nuevo artículo en respuesta a otro artículo ya existente
 *     tags: [Artículos]
 *     parameters:
 *          - in: path
 *            name: idArticulo
 *            schema:
 *              type: string
 *            required: true
 *     requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Articles'
 *     responses:
 *          201:
 *              description: Nuevo artículo creado!
 */
