<script>
    import { createForm } from 'felte'
    import { validator } from '@felte/validator-zod'
    import { authSchema } from '$lib/schemas/auth-schema'
    import { authApi } from '$lib/api/auth'
    import { auth } from '$lib/stores/auth.svelte'
    import { notification } from '$lib/stores/notification.svelte'
    import { goto } from '$app/navigation'
    import FormField from '$lib/components/FormField.svelte'

    const { form, errors, isSubmitting } = createForm({
        extend: validator({ schema: authSchema }),
        onSubmit: async (values) => {
            try {
                const result = await authApi.login(values)
                auth.login(result.token, result.user)
                notification.show('success', 'Sesión iniciada exitosamente')
                goto('/')
            } catch (err) {
                notification.show('error', err.error || 'Error al iniciar sesión')
            }
        }
    })
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8">
            <h1 class="text-3xl font-bold text-white mb-6 text-center">Iniciar Sesión</h1>
            
            <form use:form class="space-y-6">
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    errors={$errors.email}
                />

                <FormField
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    errors={$errors.password}
                />

                <button
                    type="submit"
                    disabled={$isSubmitting}
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    {#if $isSubmitting}
                        Iniciando sesión...
                    {:else}
                        Iniciar Sesión
                    {/if}
                </button>
            </form>

            <p class="mt-6 text-center text-gray-300">
                ¿No tienes cuenta? 
                <a href="/register" class="text-blue-400 hover:text-blue-300 font-semibold">
                    Regístrate
                </a>
            </p>
        </div>
    </div>
</div>
