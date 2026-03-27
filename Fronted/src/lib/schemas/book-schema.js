import {z} from 'zod'

export const bookSchema = z.object({
    title: z.string({required_error: 'El título del libro es obligatorio'}).min(1,'El título del libro no puede estar vacío'),
    description: z.string({required_error:'La descripción del libro es obligatoria'}).min(1,'La descripción del libro no puede estar vacía'),
    publishedYear: z.coerce.number({required_error:'El año de publicación es obligatorio',invalid_type_error:'El año de publicación debe ser un número'})
    .min(1888,'El año de publicación no puede ser anterior a 1888')
    .max(new Date().getFullYear(),'El año de publicación no puede ser posterior al año actual'),
    authorId: z.coerce.number({required_error:'El author es requerido',invalid_type_error:'Se debe seleccionar un author'})
    .int().positive('El author seleccionado no es válido')
})

export const bookSchemaPartial = bookSchema.partial()