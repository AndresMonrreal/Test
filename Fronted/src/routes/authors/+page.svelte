<script>
    import {onMount} from 'svelte'
    import {createForm} from 'felte'
    import {validator} from '@felte/validator-zod'
    import {authors} from '$lib/stores/author.svelte'    
    import FormField from '$lib/components/FormField.svelte'
    import Pagination from '$lib/components/pagination.svelte'
    import ConfirmModal from '$lib/components/ConfirmModal.svelte'
    import { authorSchema, authorSchemaPartial } from '$lib/schemas/author-schema'
    import ProtectedRoute from '$lib/components/ProtectedRoute.svelte'

    let showForm = $state(false)
    let editingId = $state(null)
    let deleteTarget = $state(null)

    let isEditing = $derived(editingId !== null)

    const {form, errors, isSubmitting, setFields, reset} = createForm({
        extend:validator({schema: authorSchemaPartial}),
        onSubmit: async (values) => {
            const payload = Object.fromEntries(
                Object.entries(values).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
            )
    
        if(isEditing){
            await authors.update(editingId, payload)
        }else {
            await authors.create(payload)
        }
            await authors.load(authors.page, authors.limit)
            closeForm()
    },
    })

     function openCreate() {
        editingId = null
        reset()
        showForm = true
    }

    function openEdit(author){
        console.log('author completo:', author)
        editingId = author.id
        setFields({
            name: author.name,
            nationality: author.nationality,
            birthDay: author.birthDay
        })

        showForm = true
    }


    function closeForm(){
        showForm = false,
        editingId = null,
        reset()
    }
    
    async function confirmDelete(){
        await authors.remove(deleteTarget.id)
        deleteTarget = null
        await authors.load(authors.page, authors.limit)

    }

    onMount(() => {
        authors.load()
        }
    )
</script>

<svelte:head><title>Autores</title></svelte:head>

<ProtectedRoute>
<div class = "flex-1 flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto">
    <div class="flex-1 flex flex-col gap-4">
        <div class = "flex items-center justify-between">
            <div >
                <p class = "text-[11px] font-medium tracking-widest uppercase text-white/40">Gestion</p>
                <h1 class = "font-['Playfair_Display'] text-2xl font-bold text-white">Autores</h1>
            </div>
            <button onclick={openCreate} class = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white
                bg-emerald-600/75 hover:bg-emerald-600 hover:-translate-y-px transition-all">
                <span class = "text-lg leading-none">+</span>Nuevo autor
            </button>
        </div>
        <div class = "bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {#if authors.loading}
                <div class = "flex items-center justify-center py-16 gap-2 text-white/40 text-sm">
                    <span class = "w-4 h-4 rounded-full border-2 border-white/20 border-t-white/60 animate-spin">↻</span>
                    Cargando...
                </div>
            {:else if authors.error}
                <div class = "flex items-center justify-center py-16 text-red-400 text-sm">
                    {authors.error}
                </div>
            {:else if authors.items.length === 0}
                <div class = "flex flex-col items-center justify-center py-16 gap-2 text-white/30 text-sm">
                    <span class = "text-4xl">🖊</span>
                    No hay autores registrados
                </div>    
            {:else}
                <table class = "w-full text-sm">
                    <thead>
                        <tr class = "border-b border-white/8 text-[11px] tracking-widest uppercase text-white/35">
                            <th class = "text-left px-5 py-3 font-medium">Nombre</th>
                            <th class = "text-left px-5 py-3 font-medium hidden md:table-cell">Nacionalidad</th>
                            <th class = "text-left px-5 py-3 font-medium hidden lg:table-cell">Nacimiento</th>
                            <th class = "px-5 py-3"></th>
                        </tr>
                    </thead>
             
                    <tbody>
                        {#each authors.items as author (author.id)}
                            <tr class = "border-b border-white/5 hover:bg-white/3 transition-colors">
                                    <td class="px-5 py-3.5 text-white/85 font-medium">{author.name}</td>
                                    <td class = "px-5 py-3.5 text-white/50 hidden md:table-cell">{author.nationality}</td>
                                    <td class = "px-5 py-3.5 text-white/50 hidden lg:table-cell">{author.birthDay}</td>
                                <td class = "px-5 py-3.5">
                                    <div class="flex items-center justify-end gap-1">
                                        <button onclick={() => openEdit(author)} class="w-8 h-8 flex items-center justify-center rounded-lg text-white/35 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
                                        <button onclick={() => deleteTarget = author} class="w-8 h-8 flex items-center justify-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}                
                    </tbody>  
                </table>
                <div class = "px-5 py-3 border-t border-white/8">
                    <Pagination total={authors.total}
                    page={authors.page}
                    limit={authors.limit}
                    onchange = {(p) => authors.load(p,authors.limit)}/>
                </div>
            {/if} 
        </div>
    </div>

    {#if showForm}  
        <div class ="w-full lg:w-96 flex flex-col gap-4"
            style="animation: slideIn 0.25s ease both">
            <div class = "flex items-center justify-between">
                <div>
                    <p class = "text-[11px] font-medium tracking-widest uppercase text-white/40">
                        {isEditing ? 'Editar autor' : 'Nuevo autor'}
                    </p>
                    <h2 class = "font-[Playfair_Display] text-xl font-bold text-white">
                        {isEditing ? 'Editar autor' : 'Nuevo autor'}
                    </h2>
                </div>
                <button onclick = {closeForm} class = "w-8 h-8 flex items-center justify-center rounded-lg text-white/40
                    hover:text-white/80 hover:bg-white/8 transition-all text-lg">✕</button>
            </div>
            <form use:form novalidate class = "bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <FormField label="Nombre *" name="name" placeholder="Andres Monrreal" errors={$errors.name}/>
                <FormField label="Nacionalidad" name="nationality" placeholder="Mexicanoo" errors={$errors.nationality}/>
                <FormField label="Fecha de Nacimiento" name="birthDay" type="date" errors={$errors.birthDay}/>
                <div class = "flex gap-2 pt-1">
                    <button type="button" onclick={closeForm} class = "flex-1 py-2 rounded-xl text-sm text-white/50 border border-white/10 
                        hover:bg-white/6 transition-all">Cancelar
                    </button>
                    <button type="submit" disabled={$isSubmitting} class = "flex-1 py-2 rounded-xl text-sm font-medium text-white
                        flex items-center justify-center gap-2 bg-emerald-600/75 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {#if $isSubmitting}
                            <span class = "w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                        {/if} 
                        {isEditing ? 'Guardar cambios' : 'Crear autor'}
                    </button>
                </div>
            </form>
        </div>
    {/if}
</div>
{#if deleteTarget}
    <ConfirmModal 
    open={true}
        title="Eliminar autor"
        message="¿Estás seguro de que deseas eliminar a {deleteTarget.name}? Esta acción es permanente."
        onConfirm={confirmDelete}
        onCancel={() => deleteTarget = null}
    />
{/if}
</ProtectedRoute>
