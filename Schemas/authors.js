const z =  require('zod')

const authorSchema = z.object({
    name: z.string({
        invalid_type_error: 'Autor name must be a string',
        requiere_error: 'Autor name is requiered'
    }),
    nationality: z.string({
        invalid_type_error: 'Autpor nacionality must be a string',
        requiere_type: 'Autor nationality is requiered'
    }),
    birthDate:z.string({
        invalid_type_error: 'Birthday must be a string',
        requiere_error: 'Birthday is requiered'
    })
})

function validateAuthor(input){
    return authorSchema.safeParse(input)
}

function validateAuthorPartial(input){
    return authorSchema.partial().safeParse(input)
}

module.exports={
    validateAuthor,
    validateAuthorPartial
}