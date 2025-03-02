Gestión de Usuarios - Aplicación Full Stack
Este proyecto es una aplicación full stack que permite gestionar usuarios, realizar consultas avanzadas, generar estadísticas y optimizar búsquedas. Está construido con React en el frontend, Laravel en el backend y MySQL como base de datos.

Tabla de Contenidos
Instrucciones para Ejecutar la Aplicación

Descripción de la Arquitectura

Optimizaciones Implementadas

Instrucciones para Ejecutar la Aplicación
Requisitos Previos
Node.js (v16 o superior) instalado.

PHP (v8.0 o superior) instalado.

Composer instalado.

MySQL instalado y en ejecución.

Git instalado.

Pasos para Configurar el Proyecto
1. Clonar el Repositorio
bash
Copy
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
2. Configurar el Backend (Laravel)
Navega a la carpeta del backend:

bash
Copy
cd backend
Instala las dependencias de Composer:

bash
Copy
composer install
Copia el archivo .env.example a .env y configura las variables de entorno:

bash
Copy
cp .env.example .env
Asegúrate de configurar las credenciales de la base de datos:

env
Copy
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prueba_tecnica
DB_USERNAME=admin
DB_PASSWORD=4e47nqW5rBXeApQ
Genera la clave de la aplicación:

bash
Copy
php artisan key:generate
Ejecuta las migraciones para crear las tablas en la base de datos:

bash
Copy
php artisan migrate
Inicia el servidor de Laravel:

bash
Copy
php artisan serve
3. Configurar el Frontend (React)
Navega a la carpeta del frontend:

bash
Copy
cd frontend
Instala las dependencias de Node.js:

bash
Copy
npm install
Inicia el servidor de desarrollo:

bash
Copy
npm run dev
4. Acceder a la Aplicación
Abre tu navegador y visita http://localhost:5173 para acceder al frontend.

El backend estará disponible en http://localhost:8000.

La documentación de la API se puede ver en http://127.0.0.1:8000/api/documentation.

Descripción de la Arquitectura
Frontend (React)
Componentes: La interfaz está dividida en componentes reutilizables como CustomSidebar, ProtectedRoute, y páginas como Dashboard, Login, Register, Stats, y Users.

Gestión de Estado: Se utiliza React Query para manejar el estado de las solicitudes a la API.

Autenticación: Se implementa autenticación JWT para proteger las rutas privadas.

Gráficos: Se usa Chart.js para mostrar estadísticas gráficas sobre las actividades de los usuarios.

Backend (Laravel)
API RESTful: El backend expone endpoints para gestionar usuarios (CRUD), realizar consultas avanzadas y generar estadísticas.

Autenticación: Se implementa autenticación JWT usando el paquete tymon/jwt-auth.

Base de Datos: Se utiliza MySQL con tablas users y activities para almacenar la información.

Optimización: Se aplican índices en campos clave y se optimizan las consultas para mejorar el rendimiento.

Base de Datos (MySQL)
Tabla users: Almacena información de los usuarios (nombre, email, teléfono, fecha de registro).

Tabla activities: Registra las acciones de los usuarios (user_id, acción, timestamp).

Índices: Se crean índices en campos como email y created_at para optimizar las búsquedas.

Optimizaciones Implementadas
1. Optimización de Consultas
Índices: Se crearon índices en campos clave como email y created_at para acelerar las búsquedas.

Full-Text Search: Se implementó búsqueda de texto completo en campos como name y email para consultas dinámicas.

Paginación: Las consultas de listado de usuarios incluyen paginación para manejar grandes volúmenes de datos.

2. Autenticación JWT
Se implementó autenticación basada en tokens JWT para proteger las rutas de la API y mejorar la seguridad.

3. Estadísticas en Tiempo Real
Se generan reportes en tiempo real sobre:

Usuarios registrados en los últimos 30 días.

Número de acciones realizadas por usuario.

Usuarios con mayor actividad en la plataforma.

4. Código Modular y Reutilizable
El frontend está organizado en componentes reutilizables.

El backend sigue las mejores prácticas de Laravel, con controladores y modelos bien estructurados.

5. Documentación de la API
Se documentaron todos los endpoints usando Swagger, lo que facilita la integración y pruebas. La documentación se puede acceder en http://127.0.0.1:8000/api/documentation.

Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

Nombre: Sergio Alejandro Amaya Rozo

Email: amayasergio1001@gmail.com

GitHub: https://github.com/Remisbagg
