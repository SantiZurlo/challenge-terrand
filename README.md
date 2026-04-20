# RecipeApp — Challenge Técnico Terrand

Aplicación fullstack donde los usuarios pueden registrarse y compartir recetas de cocina. Construida con Node.js + Express en el backend y React + Vite en el frontend, con Firebase Firestore como base de datos, Cloudinary para imágenes y Groq AI para sugerencias de recetas.

---

## Tecnologías utilizadas

**Backend**
- Node.js + Express
- Firebase Firestore
- JWT + bcrypt
- Cloudinary
- Groq AI (llama-3.3-70b-versatile)
- Multer

**Frontend**
- React + Vite
- React Router DOM
- Axios
- Context API

---

## 📁 Estructura del proyecto
```
challenge-terrand/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── cloudinary.js
│   │   ├── controllers/
│   │   │   ├── ai.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── ratings.controller.js
│   │   │   └── recipes.controller.js
│   │   ├── middlewares/
│   │   │   ├── not-found.js
│   │   │   ├── upload.js
│   │   │   ├── verify-token.js
│   │   │   └── welcome.js
│   │   ├── models/
│   │   │   ├── firebase.js
│   │   │   ├── Rating.js
│   │   │   ├── Recipe.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── ai.router.js
│   │   │   ├── auth.router.js
│   │   │   ├── ratings.router.js
│   │   │   └── recipes.router.js
│   │   └── services/
│   │       ├── cloudinary.service.js
│   │       └── groq.service.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   └── RecipeCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── MyRecipes.jsx
│   │   │   ├── PublicRecipe.jsx
│   │   │   ├── RecipeForm.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```
---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/challenge-terrand.git
cd challenge-terrand
```

### 2. Instalar dependencias

```bash
# Dependencias raíz (concurrently)
npm install

# Dependencias del backend
cd backend && npm install

# Dependencias del frontend
cd ../frontend && npm install
```

### 3. Configurar variables de entorno

Creá un archivo `.env` dentro de la carpeta `backend/` con los siguientes valores:

```env
PORT=3001

# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# JWT
JWT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Groq AI
GROQ_API_KEY=

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 4. Ejecutar en modo desarrollo

Desde la raíz del proyecto:

```bash
npm run dev
```

Esto levanta el backend en `http://localhost:3001` y el frontend en `http://localhost:5173`.

---

## 📌 Funcionalidades

- ✅ Registro con nombre, apellido, email y contraseña
- ✅ Login con JWT
- ✅ Sección privada para ver, crear y editar recetas
- ✅ Link público por receta (sin necesidad de login)
- ✅ Subida de imágenes con Cloudinary (drag & drop, pegar desde portapapeles)
- ✅ Sistema de calificaciones con estrellas (usuarios logueados)
- ✅ Generación de recetas con IA (Groq — llama-3.3-70b)

---
## 📡 Documentación de la API
### Auth

#### Registrar usuario
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "nombre": "Santiago",
  "apellido": "Zurlo",
  "email": "santiago@test.com",
  "password": "123456"
}
```
- **Respuesta:**
```json
{
  "token": "eyJ...",
  "user": { "id": "abc123", "nombre": "Santiago", "apellido": "Zurlo", "email": "santiago@test.com" }
}
```

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "santiago@test.com",
  "password": "123456"
}
```

---

### Recetas

> Las rutas privadas requieren header: `Authorization: Bearer <token>`

#### Obtener mis recetas
- **GET** `/api/recipes/my-recipes` 🔒

#### Crear receta
- **POST** `/api/recipes` 🔒
- **Body:** `multipart/form-data`
title: "Milanesa napolitana"
description: "Clásico de la cocina argentina"
ingredients: ["milanesa", "salsa de tomate", "jamón", "queso"]
image: archivo (opcional)
#### Ver receta pública
- **GET** `/api/recipes/public/:slug`

#### Editar receta
- **PUT** `/api/recipes/:id` 🔒

#### Eliminar receta
- **DELETE** `/api/recipes/:id` 🔒
- **Respuesta:** 204 No content

---

### Calificaciones

#### Ver calificación de una receta
- **GET** `/api/ratings/:id/rating`

#### Calificar una receta
- **POST** `/api/ratings/:id/rate` 🔒
- **Body:**
```json
{ "score": 5 }
```

---

### IA

#### Generar receta con IA
- **POST** `/api/ai/suggest` 🔒
- **Body:**
```json
{ "ingredients": "pollo, limón, ajo, papas" }
```
- **Respuesta:**
```json
{
  "title": "Pollo al limón con papas",
  "description": "...",
  "ingredients": ["pollo", "limón", "ajo", "papas"]
}
```

---

## 👨‍💻 Autor

Santiago Zurlo