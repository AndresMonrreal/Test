<!-- Este sirve para mantener todo fijo como las notificaciones y el menu de navegacion y solo cambiara el contenido de adentro-->
<script>
  import './layout.css'; 
  import {page} from '$app/stores';
  import {notification} from '$lib/stores/notification.svelte.js';
  import favicon from '$lib/assets/favicon.svg';
  import {fly} from 'svelte/transition';

  let { children } = $props(); //Representa el contenido de cada pagina, cada que se actualiza o el main en si

  const nav =[ //Es un array que contiene los enlaces de navegacion Para poder agregar secciones mas facilmente
     {href: '/', label: 'Inicio'},
     {href: '/books', label:'Libros'},
     {href: '/authors', label: 'Autores'},
  ]

</script>

{#if notification.open} 
    <div transition:fly={{y: -16,duration:250}} role="status" aria-lives="polite" class = "fixed top-4 left-1/2 -translate-x-1/2 z-50 flexç
    items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white backdrop-blur-md pointer-events-none whitespace-nowrap
    {notification.current.type === 'success' ? 'bg-emerald-600/90' : 'bg-red-600/90' }">
        <span class = "font-bold text-base">
          {notification.current.type === 'success' ? '✓' : '✗'}
        </span>
        {notification.current.message}
    </div>
{/if}

<div class = "min-h-screen flex flex-col bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

    <nav class= "border-b border-white/8 px-6">
      <div class = "max-w-6xl mx-auto flex items-center gap-l">
        <span class = "font-['Playfair_Display'] text-white/80 font-bold text-lg mr-6 py-4">Library</span>
        {#each nav as link}
          <!-- Si la ruta actual es igual a la del enlace entonces se le agrega un borde y se cambia el color del texto, de lo contrario se mantiene el estilo por defecto -->
          <a href={link.href} class = "px-4 py-4 text-sm border-b-2 transition-all {$page.url.pathname === link.href ?
        ' border-violet-400 text-white' : 'border-transparent text-white/45 hover:text-white/75'}">{link.label}</a>
        {/each}
      </div>
    </nav>
    <main class = "flex-l p-6 md:p-8">
      {@render children()}
    </main>
</div>

