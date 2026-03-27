# Skill: Nuevo Módulo CRUD

> Usar cuando se quiera agregar un nuevo recurso al proyecto (ej: categorías, reseñas, usuarios admin, etc.)

## Plan de ejecución

### Archivos a CREAR
```
Backend/
├── db/migrations/XXXXXXXXXXXXXX-create-{recurso}.js
├── db/models/{recurso}.js
├── schemas/{recurso}.js
├── service/{recurso}Service.js
├── controllers/{recurso}-controllers.js
└── routes/{recurso}-routes.js

Fronted/src/
├── lib/schemas/{recurso}-schema.js
├── lib/stores/{recurso}.svelte.js
└── routes/{recurso}/+page.svelte
```

### Archivos a MODIFICAR
```
Backend/app.js
  → Agregar: require('./routes/{recurso}-routes')
  → Agregar: app.use('/{recurso}s', {recurso}Routes)

Backend/db/models/index.js
  → Sequelize lo carga automáticamente — NO modificar manualmente

Fronted/src/routes/+layout.svelte
  → Agregar entrada al array nav[] si necesita navegación
```

### Archivos que NO se tocan
```
Todos los módulos existentes (authors, books, auth)
Backend/middlewares/validate.js       ← reutilizar tal cual
Backend/middlewares/errorHandler.js   ← reutilizar tal cual
```

### Dependencias a instalar
```bash
# Generalmente ninguna. Si el recurso necesita subida de archivos:
npm install multer
```

---

## Patrones obligatorios

### Migración — mismo patrón que `create-authors.js`
```js
'use strict'
const { NombreModelo } = require('../models')
module.exports = {
  async up(queryInterface, Sequelize) {
    const attrs = NombreModelo.getAttributes()
    await queryInterface.createTable('{recurso}s', {
      id: attrs.id,
      // ...campos del modelo
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('{recurso}s')
  }
}
```

### Modelo — mismo patrón que `authors.js`
```js
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class NombreModelo extends Model {
    static associate(models) { /* definir hasMany / belongsTo aquí */ }
  }
  NombreModelo.init({
    // campos aquí
  }, {
    sequelize,
    tableName: '{recurso}s',
    timestamps: true,
    underscored: true
  })
  return NombreModelo
}
```

### Schema Zod — mismo patrón que `schemas/authors.js` (CommonJS)
```js
const z = require('zod')
const schema = z.object({ /* campos */ }).strict()
function validate(input) { return schema.safeParse(input) }
function validatePartial(input) { return schema.partial().safeParse(input) }
module.exports = { validate, validatePartial }
```

### Servicio — lógica de BD aquí, nunca en el controlador
```js
const { NombreModelo } = require('../db/models')
module.exports.getAll = async () => NombreModelo.findAll()
module.exports.getOne = async (id) => NombreModelo.findByPk(id)
module.exports.create = async (data) => NombreModelo.create(data)
module.exports.update = async (id, data) => NombreModelo.update(data, { where: { id } })
module.exports.remove = async (id) => NombreModelo.destroy({ where: { id } })
```

### Rutas — mismo patrón que `authors-routes.js`
```js
const express = require('express')
const router = express.Router()
const controller = require('../controllers/{recurso}-controllers')
const { validate, validatePartial } = require('../schemas/{recurso}')
const validateMiddleware = require('../middlewares/validate')

router.get('/', controller.findAll)
router.get('/:id', controller.getOne)
router.post('/', validateMiddleware(validate), controller.create)
router.patch('/:id', validateMiddleware(validatePartial), controller.update)
router.delete('/:id', controller.remove)
module.exports = router
```

### Store Svelte 5 — mismo patrón que `book.svelte.js`
```js
import { {recurso}Api } from '$lib/api/api'
import { notification } from '$lib/stores/notification.svelte'

function create{Recurso}Store() {
  let items = $state([])
  let loading = $state(false)
  let error = $state(null)
  return {
    get items()   { return items },
    get loading() { return loading },
    get error()   { return error },
    async load()  { /* fetchJSON */ },
    async create(data) { /* post + notification.show('success', '...') */ },
    async update(id, data) { /* patch + reload */ },
    async remove(id) { /* delete + reload */ },
  }
}
export const {recurso}s = create{Recurso}Store()
```

---

## Endpoints estándar
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/{recurso}s` | Listar todos |
| GET | `/{recurso}s/:id` | Obtener uno |
| POST | `/{recurso}s` | Crear |
| PATCH | `/{recurso}s/:id` | Actualizar parcial |
| DELETE | `/{recurso}s/:id` | Eliminar |