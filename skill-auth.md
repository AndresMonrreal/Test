# Skill: Autenticación (Login / Registro)

## Plan de ejecución

### Archivos a CREAR
```
Backend/
├── db/migrations/XXXXXXXXXXXXXX-create-users.js
├── db/models/users.js
├── schemas/auth.js
├── service/authService.js
├── controllers/auth-controllers.js
├── routes/auth-routes.js
└── middlewares/authGuard.js

Fronted/src/
├── lib/api/auth.js
├── lib/stores/auth.svelte.js
├── lib/schemas/auth-schema.js
├── routes/login/+page.svelte
└── routes/register/+page.svelte
```

### Archivos a MODIFICAR
```
Backend/app.js
  → Línea: agregar require('./routes/auth-routes') y app.use('/auth', authRoutes)
  → Línea: agregar require('dotenv').config() al inicio

Backend/.gitignore
  → Agregar línea: .env

Fronted/src/routes/+layout.svelte
  → Agregar enlaces Login/Logout al array nav[]
  → Importar auth store para mostrar estado de sesión
```

### Archivos que NO se tocan
```
Backend/routes/authors-routes.js
Backend/routes/books-routes.js
Backend/controllers/authors-controllers.js
Backend/controllers/books-controllers.js
Backend/service/authorService.js
Backend/service/bookService.js
Backend/middlewares/validate.js
Backend/middlewares/errorHandler.js
Backend/middlewares/notFound.js
Backend/db/models/authors.js
Backend/db/models/books.js
Backend/db/config/config.json
```

### Dependencias a instalar
```bash
# En /Backend:
npm install bcrypt jsonwebtoken dotenv

# Frontend: ninguna — ya tiene fetch nativo y zod
```

---

## Implementación

### Orden obligatorio (no saltarse pasos):
1. Crear `.env` en `/Backend/`
2. Migración `users`
3. Modelo `users.js`
4. `schemas/auth.js`
5. `authService.js`
6. `auth-controllers.js`
7. `auth-routes.js`
8. `authGuard.js`
9. Modificar `app.js`
10. `lib/stores/auth.svelte.js`
11. `lib/api/auth.js`
12. `lib/schemas/auth-schema.js`
13. Página `/login/+page.svelte`
14. Página `/register/+page.svelte`
15. Modificar `+layout.svelte`

---

## Patrones exactos a seguir

### Modelo `users.js` — mismo patrón que `authors.js`
```js
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) { /* sin asociaciones por ahora */ }
  }
  User.init({
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false } // siempre hash bcrypt
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true
  })
  return User
}
```

### Schema Zod `auth.js` — mismo patrón que `schemas/authors.js` (CommonJS)
```js
const z = require('zod')
const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres')
}).strict()
function validateAuth(input) { return authSchema.safeParse(input) }
function validateAuthPartial(input) { return authSchema.partial().safeParse(input) }
module.exports = { validateAuth, validateAuthPartial }
```

### `authGuard.js` — middleware que protege rutas privadas
```js
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  const auth = req.headers['authorization']
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' })
  try {
    req.user = jwt.verify(auth.slice(7), process.env.SECRET_KEY)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
```

### Store `auth.svelte.js` — mismo patrón que `book.svelte.js` (Svelte 5 runes)
```js
function createAuthStore() {
  let token = $state(localStorage.getItem('token') ?? null)
  let user  = $state(null)
  return {
    get token()     { return token },
    get user()      { return user },
    get isLoggedIn(){ return !!token },
    login(newToken, userData) { token = newToken; user = userData; localStorage.setItem('token', newToken) },
    logout()        { token = null; user = null; localStorage.removeItem('token') }
  }
}
export const auth = createAuthStore()
```

### Endpoints
| Método | Ruta | Protegida | Body |
|--------|------|-----------|------|
| POST | `/auth/register` | No | `{ email, password }` |
| POST | `/auth/login` | No | `{ email, password }` |
| GET  | `/auth/me` | Sí (authGuard) | — |

---

## Verificación final
```bash
# Registrar usuario
curl -X POST http://localhost:4321/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'

# Login
curl -X POST http://localhost:4321/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'

# Ruta protegida (pegar token del paso anterior)
curl http://localhost:4321/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```