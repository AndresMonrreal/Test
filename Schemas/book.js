const z =  require('zod')

const bookSchema = z.object({
    title: z.string({
        invalid_type_error:'Book title must be a string',
        rquieres_error:'Book title is requiered'
    }),
    description:z.string(),
    publishedYear:z.number().min(1888).max(2026),
    authorId: z.number().int().positive()
})

function validateBook(input){
    return bookSchema.safeParse(input)
}

function validatePartialBook(input){
    return bookSchema.partial().safeParse(input)
}

module.exports ={
    validateBook,
    validatePartialBook
}