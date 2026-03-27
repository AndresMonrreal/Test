<!-- Su proposito es un form reutilizable cada vez que necesitamos un input se genera lo que necesitamos -->
<script>
//Definimo los props que recibira el componente desde afuera
    let { 
        label,  //El texto de la etiqueta del campo, es obligatorio
        name,   //El nombre del campo que es el atributo name del input
        type = 'text',  //El tipo del campo
        placeholder = '', //El texto de ayuda dentro del input 
        options = [], //Lista de opciones para el select
        errors = undefined //Errores de validacion 
    } = $props();
    //Extrae el primer mensaje de error si errors es un array o lo toma directament si es un string
    let errorMsg = $derived(Array.isArray(errors) ? errors[0] : errors);
    //Booleano que indica si hay un error presente actualmente
    let hasError = $derived(!!errorMsg);
    //Genera la clase del input dependiendo de si hay un error o no, usando clases de Tailwind para estilos
    let inputCls = $derived('w-full bg-white/6 border rounded-x1 px-4 py-2.5 text-sm text-white/90'+
        'placeholder:text-white/25 outline-none transition-all focus:bg-white/9' + (hasError ? 'border-red-400/50 focus:border-red-400/70':
            'border-white/12 focus:border-violet-400/50')
        )
</script>

<div class="flex flex-col gap-1.5">
    <label for={name} class="text-[11px] font-medium tracking-widest uppercase text-white/50">
        {label}
    </label>

    {#if type === 'textarea'}
        <textarea 
            id={name} {name} {placeholder} rows="3" 
            class=" {inputCls} resize-none min-h-[90px]"
        ></textarea>

    {:else if type === 'select'}
        <select 
            id={name} {name} 
            class="w-full bg-[#1e1a4a] border rounded-x1 px-4 py-2.5 text-sm text-white/90 outline-none 
                   transition-all focus:bg-[#231f55] 
                   {hasError ? 'border-red-400/50' : 'border-white/12 focus:border-violet-400/50'}"
        >
            <option value="">Selecciona...</option>
            {#each options as option}
                <option value={option.value} class="bg-[#302b63]">{option.label}</option>
            {/each}
        </select>

    {:else}
        <input 
            id={name} {name} type={type} {placeholder} 
            class="{inputCls}" 
        />
    {/if} 

    {#if hasError}
        <span class="text-[11px] text-red-400/70 pl-0.5" role="alert">{errorMsg}</span>
    {/if}           
</div>