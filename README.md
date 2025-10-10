# TodoApp Backend

Backend para una aplicación simple de gestión de tareas desarrollado como parte del curso de **Desarrollo y Soporte de Aplicaciones Multiplataforma (DSAM)** en **Certus**.

## 📋 Descripción

Este proyecto es la primera versión del backend para una aplicación de gestión de tareas (TodoApp), implementado utilizando las tecnologías aprendidas en la **Sesión 3** del curso DSAM.
Se añadirá nuevas versiones según las sesiones de clase.

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **Firebase Admin SDK** - Para gestión de base de datos y autenticación
- **Firestore** - Base de datos NoSQL de Firebase
- **ES6 Modules** - Sistema de módulos moderno de JavaScript

## 🚀 Características

- ✅ Crear tareas
- ✅ Listar tareas por usuario
- ✅ Actualizar tareas
- ✅ Eliminar tareas
- 🔐 Gestión de usuarios con Firebase

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── firebase.config.js    # Configuración de Firebase
├── controllers/
│   └── tasks.controller.js   # Controladores de tareas
├── routes/
│   └── tasks.routes.js       # Rutas de la API
├── services/
│   └── tasks.service.js      # Lógica de negocio
└── index.js                  # Punto de entrada de la aplicación
```

## 🏃‍♂️ Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Firebase:**
   - Coloca tu archivo `firebase-key.json` en la carpeta `src/`
   - Configura las variables de entorno si es necesario

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **El servidor estará disponible en:**
   ```
   http://localhost:3000
   ```

## 📚 API Endpoints

- `GET /api/tasks/:userId` - Obtener tareas de un usuario
- `POST /api/tasks/:userId` - Crear nueva tarea
- `PUT /api/tasks/:userId/:taskId` - Actualizar tarea
- `DELETE /api/tasks/:userId/:taskId` - Eliminar tarea

## 📖 Versión

**v1.0.0** - Primera versión con tecnologías de la Sesión 3 del curso DSAM

---

*Desarrollado como parte del curso de Desarrollo y Soporte de Aplicaciones Multiplataforma en Certus*

## 🔗 Integración con el frontend (chipicell)

Puedes usar este repositorio como backend y servir el frontend `chipicell` desde aquí para desplegar una sola app.

Pasos rápidos:

1. Sitúate en la carpeta raíz del backend y asegura que tienes instalado el frontend `chipicell` junto al backend (por ejemplo en la misma carpeta padre):

```
parent-folder/
   ├─ chipicell/      # tu frontend
   └─ TodoApp-backend-main/  # este repo (backend)
```

2. En el frontend (`chipicell`) genera la build (dependiendo de la herramienta de frontend):

```powershell
cd ..\chipicell
npm run build
```

3. Copia la build al backend (usa el script que añadimos):

```powershell
cd .\TodoApp-backend-main
npm run copy-front ..\chipicell
```

El script intentará encontrar `dist`, `build` o `public` dentro de la carpeta `chipicell` y copiará los archivos a `TodoApp-backend-main/public`.

4. Inicia el backend (servirá también los archivos estáticos):

```powershell
npm run start
```

5. Abre tu navegador en la URL del servidor (p. ej. `http://localhost:3000`) y verás la SPA servida desde el backend.

Cómo conectar la parte SPA con la API (fetch/axios)

Es importante que el frontend envíe cookies para mantener la sesión. Ejemplos:

fetch:

```javascript
fetch('http://localhost:3000/api/auth/login', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   credentials: 'include',
   body: JSON.stringify({ email, password })
})
.then(r => r.json())
```

axios:

```javascript
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.post('http://localhost:3000/api/auth/login', { email, password })
.then(r => console.log(r.data));
```

Variables de entorno útiles

- `FRONTEND_URL` - origen permitido para CORS (por defecto `http://localhost:5173`).
- `FRONTEND_BUILD_PATH` - ruta absoluta donde está la build para servir estáticamente (por defecto `./public`).

Notas

- El backend ya incluye un endpoint protegido `GET /api/auth/me` para recuperar el usuario logueado (usa la cookie `accessToken`).
- Asegúrate de configurar `JWT_SECRET` en tu `.env` antes de iniciar el servidor.
