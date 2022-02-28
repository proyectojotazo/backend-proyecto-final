/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
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
 * /users/{nickname}:
 *   get:
 *     summary: Muestra un usuario por nickname
 *     tags: [Usuarios]
 *     description: Devuelve un usuario por nickname
 *     parameters:
 *          - in: path
 *            name: nickname
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *       302:
 *         description: Muestra un usuario por nickname
 */

// POST
/**
 * @swagger
 * /users/follow/{nicknameOemailUser}:
 *   post:
 *     security:
 *          - bearerAuth: []
 *     summary: Seguir o dejar de seguir a un usuario
 *     tags: [Usuarios]
 *     description: Puedes seguir o dejar de seguir a un usuario incluyendo su "nickname" o "email" en la ruta
 *     parameters:
 *          - in: path
 *            name: nicknameOemailUser
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *       200:
 *         description: Petición realizada con éxito!
 */

/**
 * @swagger
 * /users/articles/favourites/{idArticulo}:
 *   post:
 *     security:
 *          - bearerAuth: []
 *     summary: Añadir o eliminar artículo favorito en usuario
 *     tags: [Usuarios]
 *     description: Puedes añadir o eliminar un artículo favorito al usuario autenticado
 *     parameters:
 *          - in: path
 *            name: idArticulo
 *            schema:
 *              type: string
 *            required: true
 *     responses:
 *       200:
 *         description: Se ha realizado la petición correctamente!
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
