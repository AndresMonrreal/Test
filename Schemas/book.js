const z =  requiere('zod')

const bookSchema = z.object({
    tittle: z.string({
        invalid_type_error:'Book title must be a string',
        rquieres_error:'Book title is requiered'
    }),
    description:z.string,
    publishedYear:z.number().min(1888).max(2026),
    authorId: z.number().init().positive()
})

function validateBook(input){
    return bookSchema.safeParse(input)
}

function validatPartialBook(input){
    return bookSchema.partial().safeParse(input)
}

module.exports ={
    validateBook,
    validatPartialBook
}