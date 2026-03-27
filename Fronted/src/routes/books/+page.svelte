<script>
    import {onMount} from 'svelte'
    import {createForm} from 'felte'
    import {validator} from '@felte/validator-zod'
    import {books} from '$lib/stores/book.svelte'
    import {authors} from '$lib/stores/author.svelte'
    import {bookSchema, bookSchemaPartial} from '$lib/schemas/book-schema'
    import FormField from '$lib/components/FormField.svelte'
    import Pagination from '$lib/components/pagination.svelte'
    import ConfirmModal from '$lib/components/ConfirmModal.svelte'
    import ProtectedRoute from '$lib/components/ProtectedRoute.svelte'

    let showForm = $state(false) //Para controlar si el panel lateral del formulario se muestra o no
    let editingId = $state(null) //Para guardar el id del libro que se esta editando 
    let deleteTarget = $state(null) //Para guardar el libro que se desea eliminar

    let isEditing = $derived(editingId !== null) //Para actualizar si es que editing tiene algo
    //Transforma la lista de autores en en el formato que necesita el select del formulario, es decir un array de objetos con value y label
    let authorOptions = $derived.by(() => authors.items.map(a => ({value:String(a.id), label: a.name})))
    //El onsubmit convierte el authorId y el publishedYear a numeros ya que el formulario los maneja como string, 
    //y dependiendo si se esta editando o creando un nuevo libro se llama a la funcion correspondiente del store de libros, para luego recargar la lista de libros y cerrar el formulario
    const {form,errors,isSubmitting,reset,setFields} = createForm({
        extend: validator({ schema: bookSchemaPartial }),
        onSubmit: async (values) => {
            console.log(values) 
            const payload = {
                ...values,
                authorId: Number(values.authorId),
                publishedYear: Number(values.publishedYear)
            }
           // console.log('payload enviado:', payload, 'editingId:', editingId)

            if(isEditing) {
                await books.update(editingId, payload)
            }else {
                await books.create(payload)
            }
                await books.load(books.page, books.limit)
                closeForm()
            },
    })


    function openCreate(){
        editingId = null
        reset()
        showForm = true
    }

    function openEdit(book){
        editingId = book.id
        setFields({
            title : book.title,
            description: book.description,
            publishedYear: book.publishedYear,
            authorId : book.authorId
        })

        showForm = true
    }

    function closeForm(){
        showForm = false
        editingId = null
        reset()
    }

    async function confirmDelete(){
        await books.remove(deleteTarget.id)
        await books.load(books.page, books.limit)
        deleteTarget = null
    }
    //Este es el que nos permite cargar la lista de libros y autores al iniciar la pagina
    onMount(async () => {
    await authors.loadAll()
    await books.load()
    })
</script>

<svelte:head><title>Libros</title></svelte:head>

<ProtectedRoute>
<div class = "flex-1 flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto">
    <div class = "flex-1 flex flex-col gap-4">
        <div class = "flex items-center justify-between">
            <div>
                <p class = "text-[11px] font-medium tracking-widest uppercase text-white/40">Gestion</p>
                <h1 class = "font-['Playfair_Display'] text-2xl font-bold text-white">Libros</h1>
            </div>
            <button onclick={openCreate} class = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-violet-600/80
                hover:-translate-y-px transition-all">
                <span class = "text-lg leading-none">+</span> Nuevo Libro
            </button>
        </div>
        <div class = "bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
           {#if books.loading}
                <div class = "flex items-center justify-center py-16 gap-2 text-whte/40 text-sm">
                    <span class = "w-4 h-4 rounded-full border-2 border-white/20 border-t-white/60 animate-spin"></span>
                    Cargando...
                </div>
            {:else if books.error}    
              <div class = "flex items-center justify-center py-16 text-red-400 text-sm">
                {books.error}
              </div>
            {:else if books.items.length === 0}
                <div class = "flex flex-col items-center justify-center py-16 gap-2 text-white/30 text-sm">
                    <span class = "text-4xl">📚</span>
                    No hay libros registrados
                </div>
            {:else}
             <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-white/8 text-[11px] tracking-widest uppercase text-white/35">
                        <th class="text-left px-5 py-3 font-medium">Título</th>
                        <th class="text-left px-5 py-3 font-medium hidden md:table-cell">Año</th>
                        <th class="text-left px-5 py-3 font-medium hidden lg:table-cell">Autor</th>
                        <th class="text-left px-5 py-3 font-medium hidden lg:table-cell">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {#each books.items as book(book.id)}
                        <tr class = "border-b border-white/5 hover:bg-white/3 transiton-colors">
                            <td class = "px-5 py-3.5 text-white/85 font-medium">{book.title}</td>
                            <td class = "px-5 py-3.5 text-white/85 font-medium hidden md:table-cell">{book.publishedYear}</td>
                            <td class = "px-5 py-3.5 text-white/85 font-medium hidden lg:table-cell">{authors.items.find(a => a.id === book.authorId)?.name ?? '-'}</td>
                            <td class="px-5 py-3.5 text-white/50 hidden lg:table-cell">{book.description ?? '-'}
                                <div class = "flex items-center justify-end gap-1">
                                    <button onclick={() => openEdit(book)} title="Editar"
                                       class = "w-8 h-8 flex items-center justify-center rounded-lg text-white/35 hover:text-violet-400 hover:bg-violet-400/10 transiton-all">
                                       <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox = "0 0 24 24">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15L-4 1 1-4 9.5-9.5z"/>
                                       </svg>
                                    </button>
                                    <button onclick={() => deleteTarget = book} title="Eliminar"
                                        class = "w-8 h-8 flex items-center justify-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                        <svg width="14" heigth="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                            <path d="M10 11v6M14 11v6"/>
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
             </table>   
             <div class = "px-5 py-3 border-t border-white/8">
                <Pagination total={books.total} page={books.page} limit={books.limit} onchange={(p) => books.load(p, books.limit)}/>
             </div> 
            {/if}
        </div>
    </div>

    {#if showForm}
    <div class = "w-full lg:w-96 flex flex-col gap-4" style="animation: slideIn 0.25s ease-out">
        <div class = "flex items-center justify-between">
            <div>
                <p class = "text-[11px] font-medium tracking-widest uppercase text-white/40">
                    {isEditing ? 'Editar' : 'Nuevo '}
                </p>
                <h2 class = "font-['Playfair_Display'] text-xl font-bold text-white">
                    {isEditing ? 'Editar Libro': 'Nuevo Libro'}
                </h2>
            </div>
            <button onclick={closeForm} class = "w-8 h-8 flex items-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/8 transition-all text-lg">✕
            </button>
        </div>
        <form use:form novalidate class = "bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <FormField label="Titulo *" name="title" placeholder="El principito" errors={$errors.title}/>
            <FormField label="Description" name="description" type="textarea" placeholder="Breve descripcion" errors={$errors.description}/>
            <FormField label="Año de publicacion*" name="publishedYear" type="number" placeholder="1999" errors={$errors.publishedYear}/>
            <FormField label="Autor *" name="authorId" type="select" options={authorOptions} errors={$errors.authorId}/>
            <div class="flex gap-2 pt-1">
                <button type="button" onclick={closeForm} class="flex-1 py-2 rounded-xl text-sm text-white/50 border border-white/10 hover:bg-white/6 transition-all">Cancelar
                </button>
                <button  type="submit" disabled={$isSubmitting} class="flex-1 py-2 rounded-xl text-sm font-medium text-white flex items-center justify-center
                gap-2 bg-violet-600/80 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {#if $isSubmitting}
                        <span class="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    {/if}
                    {isEditing ? 'Guardar Cambios' : 'Crear Libro'}
                </button>
            </div>
        </form>
    </div>
    {/if}
</div>

{#if deleteTarget}
    <ConfirmModal 
        open={true}
        message="¿Eliminar el libro «{deleteTarget.title}»? Esta acción no se puede deshacer"
        onConfirm={confirmDelete}
        onCancel={() => deleteTarget = null}
    />
{/if}
</ProtectedRoute>

 <style>
    @keyframes slideIn{
        from {opacity:0;transform:translateX(16px);}
        to {opacity:1; transform: translate(0);}
    }
 </style>