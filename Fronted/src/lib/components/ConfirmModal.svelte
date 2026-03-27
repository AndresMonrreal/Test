<script>
    let {
        open = false, //Para controlar si el modal se muestra o no
        message = '¿Estás seguro?', //El mensaje que se muestra en el modal, por defecto es una pregunta de confirmación
        onConfirm = () => {}, //Para confrimar una funcion que se ejecutara cuando el usuario haga click
        onCancel = () => {}, //Funcion que se ejecuta cuando el usuario cancela, por defecto no hace nada
    }= $props(); //Son las variables que podemos pasarle al componente cuando lo usamos
</script>
<!-- Si open es falso entonces todo el bloque desaparce del DOM -->
{#if open} 
    <!-- indicamos las herramientas de accesibilidad -->
    <div role = "dialog" aria-modal="true" onclick={onCancel} class = "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
    flex items-center justify-center p-4">
        <!-- El vital ya que al hacer clic dentro del modal se activa el onclick-->
        <div onclick = {(e) => e.stopPropagation()} class = "bg-[#1e1a4a] border border-white/12 rounded-2xl p-6 w-full max-w-sm
        flex-col gap-5">
            <div class = "flex flex-col gap-4">
                <div class = "w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400 text-xl">⚠</div>
                <p class = "text-sm text-white/75 loading-relaxed">{message}</p>
            </div>
            <div class = "flex gap-2 justify-end">
                <button onclick={onCancel} class = "px-4 py-2 rounded-lg text-sm text-white/55 border border-white/12 hover:bg-white/6 transition-all">Cancelar</button>
                <button onclick={onConfirm} class = "px-4 py-2 rounded-lg font-medium text-white bg-red-600/80 hover:bg-red-600 transition-all">Eliminar</button>
            </div>
        </div>
    </div>
{/if}    