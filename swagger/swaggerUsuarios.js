/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: apiKey
 *          name: Authorization
 *          in: header
 *  schemas:
 *      Users:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre
 *              apellidos:
 *                  type: string
 *                  description: Apellidos
 *              email:
 *                  type: string
 *                  description: Email
 *              nickname:
 *                  type: string
 *                  description: Nick de usuario
 *              password:
 *                  type: string
 *                  description: Contraseña
 *              articulos:
 *                  type: object
 *                  description: Artículos creados y favoritos
 *              usuarios:
 *                  type: object
 *                  description: Usuarios seguidos y seguidores
 */

// GET
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Muestra un usuario
 *     tags: [Usuarios]
 *     description: Devuelve un usuario por id
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *       302:
 *         description: Muestra un usuario por id
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#components/schemas/Users'
 */

// PATCH
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     security:
 *          - bearerAuth: []
 *     summary: Actualiza un usuario
 *     tags: [Usuarios]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *     requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                              description: Nombre
 *                          apellidos:
 *                              type: string
 *                              description: Apellidos
 *                          email:
 *                              type: string
 *                              description: Email
 *                          nickname:
 *                              type: string
 *                              description: Nick de usuario
 *                          password:
 *                              type: string
 *                              description: Contraseña
 *     responses:
 *          204:
 *              description: Usuario actualizado!
 */

// DELETE
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     security:
 *          - bearerAuth: []
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *          201:
 *              description: Usuario eliminado!
 */
