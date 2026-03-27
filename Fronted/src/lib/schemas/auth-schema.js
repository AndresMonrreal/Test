import { z } from 'zod'

export const authSchema = z.object({
    email: z.string({ required_error: 'El email es obligatorio' })
        .email('Email inválido'),
    password: z.string({ required_error: 'La contraseña es obligatoria' })
        .min(8, 'Mínimo 8 caracteres')
})
