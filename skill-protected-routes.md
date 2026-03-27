# Skill: Proteger Rutas en el Frontend

> Usar después de tener el skill-auth implementado. Requiere que `auth.svelte.js` ya exista.

## Plan de ejecución

### Archivos a CREAR
```
Fronted/src/
└── lib/components/ProtectedRoute.svelte   ← componente guard de navegación
```

### Archivos a MODIFICAR
```
Fronted/src/routes/+layout.svelte
  → Importar auth store
  → Agregar lógica de redirección global (opcional si se prefiere por página)

Cualquier +page.svelte que deba ser privada
  → Agregar bloque de protección al inicio del <script>
```

### Archivos que NO se tocan
```
Backend/*                          ← la protección de rutas frontend es solo visual
                                     la seguridad real está en authGuard.js del backend
Backend/middlewares/authGuard.js   ← ya protege los endpoints reales
```

### Dependencias a instalar
```bash
# Ninguna — SvelteKit ya incluye goto() y page store
```

---

## Implementación

### Opción A — Protección por página (recomendada para empezar)

En cada `+page.svelte` privada, agregar al inicio del `<script>`:
```js
import { goto } from '$app/navigation'
import { auth } from '$lib/stores/auth.svelte.js'
import { onMount } from 'svelte'

onMount(() => {
  if (!auth.isLoggedIn) goto('/login')
})
```

### Opción B — Componente `ProtectedRoute.svelte` reutilizable

```svelte
<!-- Fronted/src/lib/components/ProtectedRoute.svelte -->
<script>
  import { goto } from '$app/navigation'
  import { auth } from '$lib/stores/auth.svelte.js'
  import { onMount } from 'svelte'

  let { children } = $props()
  let ready = $state(false)

  onMount(() => {
    if (!auth.isLoggedIn) {
      goto('/login')
    } else {
      ready = true
    }
  })
</script>

{#if ready}
  {@render children()}
{/if}
```

Uso en cualquier página privada:
```svelte
<script>
  import ProtectedRoute from '$lib/components/ProtectedRoute.svelte'
</script>

<ProtectedRoute>
  <!-- contenido privado aquí -->
</ProtectedRoute>
```

### Modificación en `+layout.svelte` — mostrar Login/Logout en nav

Agregar al array `nav` existente y manejar el botón de logout:
```js
// En el <script> del layout
import { auth } from '$lib/stores/auth.svelte.js'
import { goto } from '$app/navigation'

function handleLogout() {
  auth.logout()
  goto('/login')
}

// El array nav ya existe, solo agregar condicionalmente:
// Si no está logueado → mostrar enlace a /login
// Si está logueado → mostrar botón Logout
```

---

## Qué rutas proteger en este proyecto

| Ruta | ¿Protegida? | Motivo |
|------|-------------|--------|
| `/` | No | Página de inicio pública |
| `/login` | No | Pública por definición |
| `/register` | No | Pública por definición |
| `/books` | Sí | Solo usuarios autenticados |
| `/authors` | Sí | Solo usuarios autenticados |

---

## Verificación
1. Sin token: navegar a `/books` → debe redirigir a `/login`
2. Con token válido: navegar a `/books` → debe mostrar el contenido normal
3. Hacer logout → debe redirigir a `/login` y limpiar localStorage