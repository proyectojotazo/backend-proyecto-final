/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

// GET
/**
 * @swagger
 * /comment/{idComentario}:
 *   get:
 *     security:
 *          - bearerAuth: []
 *     summary: Muestra un comentario
 *     tags: [Comentarios]
 *     description: Devuelve un comentario por id
 *     parameters:
 *          - in: path
 *            name: idComentario
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *       302:
 *         description: Muestra un comentario por id
 */

// POST
/**
 * @swagger
 * /comment/{idArticulo}:
 *   post:
 *     security:
 *          - bearerAuth: []
 *     summary: Realizar comentario en un artículo
 *     tags: [Comentarios]
 *     description: Realiza un comentario en un artículo
 *     parameters:
 *          - in: path
 *            name: idArticulo
 *            schema:
 *              type: string
 *            required: true
 *     requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          contenido:
 *                              type: string
 *                              description: Comentario
 *                      required:
 *                          - contenido
 *     responses:
 *          201:
 *              description: Comentario realizado con éxito!
 */

/**
 * @swagger
 * /comment/response/{idComentario}:
 *   post:
 *     security:
 *          - bearerAuth: []
 *     summary: Responder al comentario de un artículo
 *     tags: [Comentarios]
 *     description: Responde al comentario de un artículo
 *     parameters:
 *          - in: path
 *            name: idComentario
 *            schema:
 *              type: string
 *            required: true
 *     requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          contenido:
 *                              type: string
 *                              description: Comentario
 *                      required:
 *                          - contenido
 *     responses:
 *          201:
 *              description: Respuesta a comentario realizada con éxito!
 */

/* DELETE */
/**
 * @swagger
 * /comment/{idComentario}:
 *   delete:
 *     security:
 *          - bearerAuth: []
 *     summary: Elimina un comentario proporcionando su ID
 *     tags: [Comentarios]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *          200:
 *              description: Comentario eliminado!
 */
