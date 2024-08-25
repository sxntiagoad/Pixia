# Proyecto de Autenticación

Este proyecto es una API de autenticación utilizando Node.js y MongoDB.

## Requisitos

- Node.js (v14 o superior)
- MongoDB

## Instalación

Sigue estos pasos para clonar el repositorio y configurar el proyecto:

1. Clona el repositorio:

    ```sh
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

3. Configura las variables de entorno:

    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

    ```env
    MONGODB_URI=mongodb://localhost:27017/tu-base-de-datos
    PORT=3000
    ```

4. Inicia MongoDB:

    Asegúrate de que MongoDB esté corriendo. Puedes iniciar MongoDB con el siguiente comando:

    ```sh
    mongod
    ```

5. Inicia la aplicación:

    ```sh
    npm start
    ```

## Endpoints

### Registro

- **URL:** `/register`
- **Método:** `POST`
- **Descripción:** Registra un nuevo usuario.
- **Cuerpo de la solicitud:**

    ```json
    {
        "username": "tu-usuario",
        "email": "tu-email@example.com",
        "password": "tu-contraseña"
    }
    ```

### Login

- **URL:** `/login`
- **Método:** `POST`
- **Descripción:** Inicia sesión con un usuario existente.
- **Cuerpo de la solicitud:**

    ```json
    {
        "email": "tu-email@example.com",
        "password": "tu-contraseña"
    }
    ```

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios a tu fork (`git push origin feature/nueva-funcionalidad`).
5. Crea un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
