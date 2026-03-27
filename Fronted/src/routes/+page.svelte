<script >
    import {goto} from '$app/navigation'

    const options = [
        {
            label: 'Libros',
            desc: 'Lista, crea y edita Libros',
            route: '/books',
            iconBg: 'bg-violet-500/20',
            iconColor: 'text-violet-300',
            icon: `<path d = "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.6 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2 2.5 0 0 1 6.5 2z"/>`,
        },

        {
            label: 'Autores',
            desc: 'Lista,crea y edita Autores',
            route: '/authors',
            iconBg: 'bg-emerald-500/70',
            iconColor: 'text-emerald-300',
            icon:`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
        },
    ]
</script>

<svelte:head><title>Library</title></svelte:head>

<section class = "min-h-[70vh] flex items-center justify-center relative overflow-hidden">

    <div class = "relative z-10 flex flex-col items-center text-center">
        <h1 class = "font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white leading-tigth mb-4">
            ¿Qué deseas<br/>gestionar hoy?
        </h1>
        <div class = "flex flex-wrap gap-4 justify-center">
            {#each options as option}
                <button onclick={() => goto(option.route)} class = "w-52 flex flex-col items-start gap-3 text-left p-6 rounded-2xl bg-white/5 border
                    border-white/10 hover:bg white/9 hover:bg-whitw/20 hover:-translate-y-1.5 transition-all duration-200 group">
                    <div class = "w-11 h-11 rounded-xl flex items-center justify-center {options.iconBg} {options.iconColor}">
                        <svg width="22" heigth="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                            stroke-linejoin="round" viewBox="0 0 24 24">
                            {@html option.icon}
                        </svg>
                    </div>
                    <span class = "text-sm font-medium text-white/85">{option.label}</span>
                    <span class = "text-xs text-white/40 loading-relaxed">{option.desc}</span>
                    <span class = "text-white/30 group-hover:translate-x-1.5 transition-transform duration-200 text-lg">→</span>
                </button>
            {/each}    
        </div>
    </div>
</section>