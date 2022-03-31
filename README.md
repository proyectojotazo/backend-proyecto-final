# Bootcamp Full Stack Web Developer #

## Proyecto Final: "El Último & Me Voy" - Backend

### EL ÚLTIMO & ME VOY

> *Este repositorio es la parte "Backend" del proyecto final del Bootcamp, el cual hemos llamado: "El Último & Me Voy".*

"El Último & Me Voy" es una aplicación web de "*Blogging*" enfocada en temas relacionados con la programación y, más concretamente, con la programación web. 

En esta aplicación se brinda al usuario la posibilidad de leer, buscar o compartir cualquier tipo de artículo relacionado con la tecnología web que más le interese. Además, también tiene la posibilidad de hacerse miembro realizando el proceso de registro, y esto, le añadirá más funcionalidades, como: crear artículos y así contribuir a la plataforma, crear artículos en respuesta a otros artículos, seguir usuarios, tener seguidores, guardar artículos como favoritos, comentar artículos, recibir notificaciones en el correo electrónico, etc.


## Equipo

[![](https://contrib.rocks/image?repo=proyectojotazo/backend-proyecto-final)](https://github.com/proyectojotazo/backend-proyecto-final/graphs/contributors)

## Repositorios

- Frontend: **[https://github.com/proyectojotazo/frontend-proyecto-final](https://github.com/proyectojotazo/frontend-proyecto-final)**
- Backend: **[https://github.com/proyectojotazo/backend-proyecto-final](https://github.com/proyectojotazo/backend-proyecto-final)**

## Despliegue en producción

A modo de demostración, la aplicación se encuentra desplegada en AWS, en el siguiente enlace:

**[https://elultimoymevoy.com](https://elultimoymevoy.com)**

## Instrucciones

#### Instalar dependencias:

Antes de nada debemos usar el siguiente comando para instalar todas las dependencias del proyecto:

    npm install

#### Configurar variables de entorno:

Para configurar las variables de entorno, deberemos crear un archivo `.env` en la raíz del proyecto y añadir las variables de entorno proporcionadas en el archivo `.example.env`, con los valores que queramos usar.

Estructura del `.env`:

    	# PORTS
		PRODUCTION_PORT=<Aquí el puerto para producción>
		DEV_PORT=<Aquí el puerto para entorno de desarrollo>
		TEST_PORT=<Aquí el puerto para ejecutar los test>
		
		# DB_URI
		MONGODB_URI=<Colocar la ruta a la base de datos de producción>
		MONGODB_URI_DEV=mongodb://localhost/<Nombre para base de datos dev en local>
		MONGODB_URI_TEST=mongodb://localhost/<Nombre para base de datos test en local>
		
		#BCRYPT
		SALT=<Incluir "Salt" para el hash (número a elegir)>
		
		# JWT_TOKEN
		JWT_SECRET=<Aquí tu clave secreta para JWT>
		JWT_EXPIRES_IN=<Tiempo de caducidad del token (ejemplo: 30d)>
		
		# EMAIL_SENDER_CONFIG
		HOST=<Host para envío de email (ejemplo: smtp.gmail.com)>
		USER=<Dirección de email (ejemplo: demo@gmail.com)>
		PASS=<Contraseña de la dirección email>
		SERVICE=<Servicio de envío (ejemplo: gmail)>
		BASE_URL=<URL Base Frontend (ejemplo: http://localhost:3000)>

#### Añadir fichero .npmrc (sólo en Windows)

Si se usa Windows, deberemos crear el archivo `.npmrc` en la carpeta raíz del proyecto y dentro incluir la siguiente línea:

    	script-shell = "C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
> Con esa línea le estaríamos pasando la ruta por defecto de PowerShell en Windows, para que pueda ejecutar correctamente los scripts incluidos en el `package.json`.

#### Iniciar proyecto en entorno de producción:

Para iniciar el proyecto en entorno de producción, usar el comando:

    npm start

> Esto iniciará el proyecto en el puerto configurado en el archivo `.env`, con la base de datos usada para producción. Al no usarse "nodemon" con este comando, será necesario reiniciar el servidor cada vez que apliquemos cambios sobre el proyecto.

#### Iniciar proyecto en entorno de desarrollo:

Para iniciar el proyecto en entorno de desarrollo, usar el comando:

    npm run dev

> Esto iniciará el proyecto en el puerto configurado en el archivo `.env`, con "nodemon", por lo que podremos realizar cambios y que estos se apliquen sin necesidad de reiniciar el servidor.

#### Iniciar comprobación de test:

Para iniciar la comprobación de todos los test realizados, usar el comando:

    npm run test

> Esto iniciará la comprobación de todos los test realizados sobre el proyecto, por consola. Una vez terminada la comprobación, devolverá los resultados, indicando cuales han pasado o han fallado.

## Rutas del API

![](https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.svg)

El API dispone de una documentación a través de Swagger, para poder probar todos los endpoints disponibles. La ruta de acceso al Swagger del API es la siguiente:

    	http://localhost:3001/swagger

> *Para las peticiones, se usará como referencia http://localhost:3001, pero el puerto dependerá del que configuremos a través de las variables de entorno en el archivo `.env`*

### GET:

**- Usuarios -**

Mostrar usuario por su Nickname o ID de Usuario:

    	http://localhost:3001/users/<nickNameOrUserId>
> Esta petición se puede realizar indicando el nick del usuario en mayúscula o minúscula o el ID de usuario. La búsqueda se hará en minúscula indistintamente, ya que así es como se almacena en la base de datos.

**- Artículos -**

Mostrar todos los artículos:

    	http://localhost:3001/articles

Mostrar artículo por ID:

    	http://localhost:3001/articles/<IdArticulo>

Para mostrar los resultados de los artículos en orden "ascendente" o "descendente", se le puede aplicar la condición a la url, según el campo que queramos tener en cuenta para ordenar. 

Por ejemplo:

Orden Ascendente - Muestra artículos por fecha de publicación ascendente (antiguos primero):

    	http://localhost:3001/articles?sort=fechaPublicacion

Orden Descendente - Muestra artículos por fecha de publicación descendente (nuevos primero):

    	http://localhost:3001/articles?sort=-fechaPublicacion

Mostrar categorías disponibles:

    	http://localhost:3001/articles/categories

**- Comentarios -**

Mostrar comentario por ID:

    	http://localhost:3001/comment/<idComentario>

### POST:

**- Usuarios -**

Registrar un usuario:

    	http://localhost:3001/register
Iniciar sesión con usuario:

    	http://localhost:3001/login
> Esta petición nos devolverá un token para poder hacer futuras peticiones.

Restablecer contraseña:

    	http://localhost:3001/password-reset
> Se debe enviar un objeto en el "body" con la clave "email" y como valor el email del usuario.

> Si existe un usuario con ese email, se enviará un correo electrónico a la dirección del usuario, con un link que tendrá la petición para cambiar su contraseña por una nueva. El link tendrá la siguiente estructura:

> **http://localhost:3001/password-reset/IdUsuario/TokenTemporalGenerado**

> Para enviar la petición generada al API, se deberá añadir un objeto en el "body" con la clave "password" y como valor la nueva contraseña, para que pueda ser modificada correctamente.

Seguir o dejar de seguir a un usuario:

    	http://localhost:3001/users/follow/<IdUsuario>
> Puedes seguir o dejar de seguir a un usuario añadiendo a la ruta su ID de usuario.

> Si no sigues al usuario, se añadirá a tus seguidos y a su vez se te añadirá a ti como seguidor en el usuario que has seguido. Si ya sigues a este usuario, se os eliminará a ambos como usuario seguido y seguidor, respectivamente.

> Esta petición necesita el header "Authorization" con el valor `Bearer <token>`


Añadir o eliminar un artículo de favoritos:

    	http://localhost:3001/users/articles/favourites/<idArticulo>
> Puedes añadir o eliminar artículos favoritos a un usuario autenticado, incluyendo el id del artículo en la ruta. Al hacer la petición si el artículo no esta en tus artículos favoritos, lo añade, si no eliminará el artículo de favoritos con la misma petición.

> Esta petición necesita el header "Authorization" con el valor `Bearer <token>`

**- Artículos -**

Crear un artículo:

    	http://localhost:3001/articles
> Para poder crear un artículo será necesario incluir el valor `Bearer <token>`, en la cabecera "Authorization".

> Será necesario incluir un "body" con al menos los siguientes campos requeridos: "titulo", "textoIntroductorio" y "contenido".

Crear un nuevo artículo en respuesta a otro artículo:

    	http://localhost:3001/articles/response/{idArticulo}
> Funciona igual que "Crear un artículo", sólo hay que añadir a la ruta el id del artículo existente del que se quiera crear la respuesta.

> Al realizar la petición se añadirá automáticamente el id y título del artículo del que se crea la respuesta a la base de datos.

Realizar búsqueda de artículos:

    	http://localhost:3001/articles/search
> Es necesario enviar un "body" con el campo "search" y con el contenido que queramos buscar. Se buscarán artículos que coincidan con: título, introducción y contenido del artículo (indistintamente de si es mayúscula o minúscula).

> A la ruta, se le pueden añadir los mismos parámetros condicionales que en "GET /articles" (filtro, orden, paginación, etc.)

**- Comentarios -**

Añadir un comentario a un artículo:

    	http://localhost:3001/comment/<idArticulo>

Responder a un comentario de un artículo:

    	http://localhost:3001/comment/response/<idComentario>
> Para realizar ambas peticiones será necesario incluir el valor `Bearer <token>`, en la cabecera "Authorization".

### PATCH:

**- Usuarios -**

Actualizar un usuario (estando autenticado):

    	http://localhost:3001/users/<IdUsuario>
> Al usar PATCH, sólo será necesario enviar un "body" con los campos que quieran actualizarse y no todos los campos.

> Para poder actualizar un usuario, se necesitará incluir el valor `Bearer <token>` del usuario que creó el usuario a modificar, en la cabecera "Authorization". Si se intentara actualizar un usuario con un token válido, perteneciente a otro usuario, devolvería un error.

> Si el usuario no existe, también devolverá un error.

**- Artículos -**

Actualizar un artículo:

    	http://localhost:3001/articles/<IdArticulo>
> Al usar PATCH, sólo será necesario enviar un "body" con los campos que quieran actualizarse y no todos los campos.

> Para poder actualizar un artículo, se necesitará incluir el valor `Bearer <token>` del usuario creador de ese artículo, en la cabecera "Authorization". Si se intentara actualizar un artículo con un token válido, perteneciente a otro usuario, devolvería un error.

> Si el artículo no existe, también devolverá un error.

### DELETE:

**- Usuarios -**

Eliminar un usuario (y los anuncios que hubiese creado):

    	http://localhost:3001/users/<IdUsuario>
> Para poder eliminar un usuario será necesario incluir el valor `Bearer <token>` del usuario correspondiente en la cabecera "Authorization". Si se intentara eliminar un usuario con un token válido, perteneciente a otro usuario, devolvería un error.

> Se eliminará toda la información del usuario en la base de datos, incluidos los artículos que ese usuario hubiese creado y su carpeta de archivos de imágenes/vídeos subidos con esos artículos.

**- Artículos -**

Eliminar un artículo:

    	http://localhost:3001/articles/<IdArticulo>
> Para poder eliminar un artículo, se necesitará incluir el valor `Bearer <token>` del usuario creador de ese artículo, en la cabecera "Authorization". Si se intentara eliminar un artículo con un token válido, perteneciente a otro usuario, devolvería un error.

> Se eliminará el archivo de imagen/vídeo subido con el artículo de su carpeta de usuario

**- Comentarios -**

Eliminar un comentario de un artículo:

    	http://localhost:3001/comment/<idComentario>

> Esta acción eliminará el comentario de la colección "Comentarios" y del artículo al que pertenezca ese comentario

