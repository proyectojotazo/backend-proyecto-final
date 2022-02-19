# Bootcamp Full Stack Web Developer #


## Proyecto Final: "El último y me voy" - Backend

### EL ÚLTIMO Y ME VOY

Backend del proyecto final...


## Instrucciones

#### Instalar dependencias:

Antes de nada debemos usar el siguiente comando para instalar todas las dependencias del proyecto:

    npm install

#### Configurar variables de entorno:

Para configurar las variables de entorno, deberemos crear un archivo `.env` en la raíz del proyecto y añadir las variables de entorno proporcionadas en el archivo `.example.env`, con los valores que queramos usar.

#### Iniciar en modo desarrollo:

Para arrancar el proyecto en modo desarrollo, usar el comando:

    npm run dev

> Esto nos iniciará el proyecto con "nodemon", por lo que podremos realizar cambios y que estos se apliquen, estando el servidor arrancado.

## Rutas del API

#### GET:

**- Usuarios -**

Mostrar usuario por ID:

    	http://localhost:3001/users/<IdUsuario>

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


#### POST:

**- Usuarios -**

Registrar un usuario:

    	http://localhost:3001/register
Iniciar sesión con usuario:

    	http://localhost:3001/login
> Esta petición nos devolverá un token para poder hacer futuras peticiones.

**- Artículos -**

Crear un artículo:

    	http://localhost:3001/articles
> Para poder crear un artículo será necesario un token válido, incluido en la cabecera "Authorization".

> Será necesario incluir un "body" con al menos los siguientes campos requeridos: "titulo", "textoIntroductorio" y "contenido".

#### PATCH:

**- Usuarios -**

Actualizar un usuario (estando autenticado):

    	http://localhost:3001/users/<IdUsuario>
> Al usar PATCH, sólo será necesario enviar un "body" con los campos que quieran actualizarse y no todos los campos.

> Para poder actualizar un usuario, se necesitará incluir el token del usuario que creó el usuario a modificar, en la cabecera "Authorization". Si se intentara actualizar un usuario con un token válido, perteneciente a otro usuario, devolvería un error.

> Si el usuario no existe, también devolverá un error.

**- Artículos -**

Actualizar un artículo:

    	http://localhost:3001/articles/<IdArticulo>
> Al usar PATCH, sólo será necesario enviar un "body" con los campos que quieran actualizarse y no todos los campos.

> Para poder actualizar un artículo, se necesitará incluir el token del usuario creador de ese artículo en la cabecera "Authorization". Si se intentara actualizar un artículo con un token válido, perteneciente a otro usuario, devolvería un error.

> Si el artículo no existe, también devolverá un error.

#### DELETE:

**- Usuarios -**

Eliminar un usuario (y los anuncios que hubiese creado):

    	http://localhost:3001/users/<IdUsuario>
> Para poder eliminar un usuario será necesario incluir el token del usuario correspondiente en la cabecera "Authorization". Si se intentara eliminar un usuario con un token válido, perteneciente a otro usuario, devolvería un error.

> Se eliminará toda la información del usuario en la base de datos, incluidos los artículos que ese usuario hubiese creado.

**- Artículos -**

Eliminar un artículo:

    	http://localhost:3001/articles/<IdArticulo>
> Para poder eliminar un artículo, se necesitará incluir el token del usuario creador de ese artículo en la cabecera "Authorization". Si se intentara eliminar un artículo con un token válido, perteneciente a otro usuario, devolvería un error.

