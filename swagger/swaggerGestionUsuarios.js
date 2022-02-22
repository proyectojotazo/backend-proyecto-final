/**
 * @swagger
 * components:
 *  schemas:
 *      UserRegister:
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
 *                  description: Correo electrónico
 *              nickname:
 *                  type: string
 *                  description: Nick de usuario
 *              password:
 *                  type: string
 *                  description: Contraseña
 *          required:
 *              - nombre
 *              - apellidos
 *              - email
 *              - nickname
 *              - password
 */

// REGISTER USER
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra nuevo usuario
 *     tags: [Usuarios]
 *     description: Crea un nuevo usuario
 *     requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/UserRegister'
 *     responses:
 *          201:
 *              description: Nuevo usuario creado!
 */

// LOGIN USER
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión con usuario
 *     tags: [Usuarios]
 *     description: Inicia sesión con un usuario
 *     requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Correo electrónico
 *                          password:
 *                              type: string
 *                              description: Contraseña
 *                      required:
 *                          - email
 *                          - password
 *     responses:
 *          200:
 *              description: Has iniciado sesión con éxito!
 */

// PASSWORD RESET
/**
 * @swagger
 * /password-reset:
 *   post:
 *     summary: Solicita cambio de contraseña para un usuario
 *     tags: [Usuarios]
 *     description: Envía un email al usuario para restablecer contraseña
 *     requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Correo electrónico
 *                      required:
 *                          - email
 *     responses:
 *          200:
 *              description: Email de recuperación enviado con éxito!
 */

/**
 * @swagger
 * /password-reset/{userId}/{token}:
 *   post:
 *     summary: Recuperar contraseña de un usuario
 *     tags: [Usuarios]
 *     description: Petición enviada al email del usuario (incluir userId y token)
 *     parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *          - in: path
 *            name: token
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
 *                          password:
 *                              type: string
 *                              description: Contraseña
 *                      required:
 *                          - password
 *     responses:
 *          200:
 *              description: Has cambiado tu contraseña con éxito!
 */
