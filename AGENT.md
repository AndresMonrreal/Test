AGENT.md — Library App (Proyecto Test)

Instrucción crítica: Lee este archivo completo antes de escribir cualquier código.
Si el contexto actual ya supera el 70%, detente y pide al humano que abra una nueva sesión antes de continuar.


0. Control de Ventana de Contexto
Antes de cada respuesta larga, estima internamente cuánto contexto estás usando.
Estado Qué hacer < 50% Trabajar con normalidad 50–70% Avisar:" Contexto al ~X%. Recomiendo terminar esta tarea antes de pedir otra."> 70% Detenerse: "Contexto crítico. Abre una sesión nueva y pega solo el skill que necesites."
Regla de oro: Nunca cargues todo el proyecto en memoria. Carga solo el skill relevante a la tarea actual.

1. Identidad del Proyecto

Nombre: Library App — gestión de libros y autores
Repo: https://github.com/AndresMonrreal/Test.git
Stack Backend: Node.js + Express 5 + Sequelize 6 + MySQL (test_db, host 127.0.0.1)
Stack Frontend: SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS 4
Módulo Backend: CommonJS (require/module.exports)
Módulo Frontend: ESM (import/export)


2. Arquitectura Backend
Backend/
├── app.js                  ← Entry point. Registra rutas, middlewares globales
├── routes/                 ← Solo define rutas y conecta middlewares + controladores
├── controllers/            ← Maneja req/res. Sin lógica de negocio
├── service/                ← Toda la lógica de negocio y acceso a BD
├── middlewares/
│   ├── validate.js         ← Recibe función Zod, valida req.body, llama next()
│   ├── errorHandler.js     ← Manejo centralizado de errores (statusCode || 500)
│   └── notFound.js         ← 404 handler
├── schemas/                ← Funciones de validación Zod (validateX, validateXPartial)
├── db/
│   ├── config/config.json  ← Credenciales MySQL por entorno
│   ├── models/             ← Modelos Sequelize (clase extends Model + Model.init())
│   ├── migrations/         ← Migraciones con queryInterface
│   └── seeders/            ← Datos de prueba
└── utils/                  ← Helpers (ej: pagination.js)
Flujo de una petición:
Request → Route → validate middleware → Controller → Service → DB → Response

3. Arquitectura Frontend
Fronted/src/
├── routes/                 ← Páginas SvelteKit (file-based routing)
│   └── +layout.svelte      ← Layout raíz: nav, notificaciones, fondo global
├── lib/
│   ├── api/api.js          ← fetchJSON wrapper. BASE = 'http://localhost:4321'
│   ├── stores/             ← Estado global con Svelte 5 runes ($state, $derived)
│   ├── schemas/            ← Validación Zod para formularios frontend
│   └── components/         ← Componentes reutilizables
│       ├── FormField.svelte ← Input/select/textarea con manejo de errores
│       ├── ConfirmModal.svelte
│       └── pagination.svelte
Patrón de stores (Svelte 5 runes):
jsfunction createXStore() {
  let items = $state([])
  // ...
  return {
    get items() { return items },
    async load() { ... },
    async create(data) { ... },
  }
}
export const x = createXStore()

4. Patrones que SIEMPRE debes respetar
Backend

Servicios: toda consulta a BD va en service/. Los controladores solo llaman servicios.
Validación: usar validate.js middleware + esquemas Zod. Ya existe, no recrear.
Errores: lanzar const err = new Error('msg'); err.statusCode = 4xx; throw err — el errorHandler lo captura.
Modelos: extender Model, usar Model.init(), timestamps: true, underscored: true.
Variables de entorno: cargar con dotenv. Nunca hardcodear secretos en el código.

Frontend

Solo Svelte 5 runes: $state(), $derived(), $props(). Nunca usar writable() ni readable() de Svelte 4.
Notificaciones: usar notification.show('success'|'error', 'mensaje') del store existente.
FormField: reutilizar el componente para todos los inputs. Props: label, name, type, placeholder, errors.
Estilos: Tailwind 4. El tema visual es oscuro: bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]. Mantener consistencia.


5. Reglas de Ejecución (Plan Mode + HITL)

Antes de escribir cualquier código, sigue estos pasos en orden.

Paso 1 — Identificar el skill necesario
Lee solo el skill correspondiente a la tarea. No leas todos los skills a la vez.
TareaSkill a cargarAutenticación (login/registro)skill-auth.mdNuevo módulo CRUDskill-crud.mdCrear archivo .envskill-env.md
Proteger rutas frontendskill-protected-routes.md
Paso 2 — Presentar Plan (Plan Mode)
Antes de código, presenta:

PLAN:
1. Archivos a CREAR: [lista]
2. Archivos a MODIFICAR: [lista + qué líneas cambian]
3. Archivos que NO se tocan: [lista]
4. Dependencias a instalar: [lista]
¿Apruebas este plan? (sí/ajusta X/no)
Paso 3 — Human Gate (esperar aprobación)
No escribir código hasta recibir aprobación. Si el humano dice "ajusta X", modificar el plan.
Paso 4 — Ejecutar por bloques
Entregar un archivo a la vez. Preguntar "¿continúo con el siguiente?" si el cambio es grande.
Paso 5 — Verificación
Al finalizar, listar qué probó y cómo verificarlo:
Para probar: curl -X POST http://localhost:4321/auth/login -d '{"email":"...","password":"..."}'

6. Lo que NUNCA debes hacer

Modificar authors-routes.js, books-routes.js o sus controladores/servicios
Guardar contraseñas en texto plano
Hardcodear SECRET_KEY o credenciales en el código fuente
Usar la API de Svelte 4 (writable, readable, derived importados de svelte/store)
Romper la funcionalidad existente de libros y autores
Crear un "God Agent" que intente hacer todo en una sola respuesta gigante
Continuar si la ventana de contexto supera el 70%


7. Archivos de entorno
El archivo .env no existe aún en el proyecto. Cuando sea necesario, crearlo en /Backend/.env con este contenido mínimo:
env# Base de datos (ya configurada en config.json, pero si migras a env:)
DB_USER=root
DB_PASSWORD=admin
DB_NAME=test_db
DB_HOST=127.0.0.1

# JWT
SECRET_KEY=reemplaza_esto_con_una_clave_larga_y_aleatoria_minimo_32_caracteres
JWT_EXPIRES_IN=24h

# Servidor
PORT=4321
NODE_ENV=development

Agregar /Backend/.env al .gitignore del Backend (ya existe el .gitignore, solo agregar la línea .env).


