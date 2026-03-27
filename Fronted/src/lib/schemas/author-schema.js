import {z} from 'zod'

export const authorSchema = z.object({
    name: z.string({required_error: 'El nombre del autor es obligatorio'})
        .min(1, 'El nombre del autor no puede estar vacío'),
    nationality: z.string().min(1, 'La nacionalidad no puede estar vacía').optional(),
    birthDay: z.string().min(1, 'La fecha de nacimiento no puede estar vacía').optional(),
})

export const authorSchemaPartial = authorSchema.partial()