# Skill: Crear archivo `.env`

## Plan de ejecución

### Archivos a CREAR
```
Backend/.env          ← variables de entorno (nunca subir a git)
```

### Archivos a MODIFICAR
```
Backend/app.js
  → Primera línea: agregar require('dotenv').config()

Backend/.gitignore
  → Agregar línea: .env
```

### Archivos que NO se tocan
```
Backend/db/config/config.json   ← credenciales de Sequelize CLI (separadas del .env)
Todo el resto del proyecto
```

### Dependencias a instalar
```bash
npm install dotenv
```

---

## Contenido del `.env`

Crear el archivo en `/Backend/.env` con exactamente esto:

```env
# Servidor
PORT=4321
NODE_ENV=development

# JWT — cambiar SECRET_KEY por una cadena larga y aleatoria (mínimo 32 caracteres)
SECRET_KEY=cambia_esto_por_algo_largo_y_aleatorio_ej_x7k2mP9qL4nR8vW3
JWT_EXPIRES_IN=24h
```

> `SECRET_KEY` debe ser única y secreta. Nunca compartirla ni subirla a GitHub.
> Tip para generar una clave segura en terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## Modificación en `app.js`

Agregar como **primera línea** del archivo:
```js
require('dotenv').config()
// ... resto del código existente
```

---

## Verificación
```bash
# En /Backend, ejecutar:
node -e "require('dotenv').config(); console.log(process.env.SECRET_KEY)"
# Debe imprimir tu clave secreta, no 'undefined'
```