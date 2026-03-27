<script>
    let { 
        total = 0,  //Cantidad total de regitros 
        page = 1,   //Pagina actual
        limit = 10,    //Cantidad de registros por pagina
        onchange = () => {} //Funcion que se ejecuta al cambiar de pagina, recibe la nueva pagina como argumento
    } = $props();
    //Para calcular cuantas paginas hay en total
    let totalPages = $derived(Math.ceil(total / limit));
    //Crea la lista de numeros que se veran en pantalla 
    //Y va filtrando para mostrar solo el primero, el ultimo y los que estan alrededor de la pagina actual
    let pages = $derived(
        Array.from({ length: totalPages }, (_, i) => i + 1)
             .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    );
</script>

{#if totalPages > 1}
    <div class="flex items-center justify-between">
    <!-- Muestra el rango de registros -->
        <p class="text-xs text-white/40">
            {(page - 1) * limit + 1} - {Math.min(page * limit, total)} de {total}
        </p>
        <!-- Son los botones de navegacion entre paginas -->
        <div class="flex items-center gap-2">
            <button 
                onclick={() => onchange(page - 1)}
                disabled={page === 1} 
                class="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 border border-white/10 hover:bg-white/8
                disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                ,
            </button>
                <!-- Recorre la lista de paginas y muestra un boton para cada una -->
                {#each pages as p, i}
                    {#if i > 0 && pages[i] - pages[i-1] > 1}
                        <span class="text-white/30 px-1 text-xs">...</span>
                    {/if}

                    <button 
                        onclick={() => onchange(p)} 
                        class="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-all
                        {p === page 
                            ? 'bg-violet-600/90 text-white border-violet-400/50 ' 
                            : 'text-white/60 border-white/10 hover:bg-white/8'}">
                        {p}</button>
                {/each}

            <button 
                onclick={() => onchange(page + 1)}
                disabled={page === totalPages} 
                class="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-white/50 border border-white/10
                 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                ,
            </button>
        </div>
    </div>
{/if}