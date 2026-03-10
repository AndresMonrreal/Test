
const { file } = require('zod')
const db =  require('../db/models')
const {Book} = db
const {getPagination, getPagingData} = require('../utils/pagination')

const {validateBook,validatePartialBook} = require('../schemas/book')

module.exports.findAll = async (req, res) => {
    try{
        const {page,size,year,Authorid} = req.query
        const {limit, offset} = getPagination(page,size)



        const activeScopes = [
            'novedades',
            {method: ['conAuthorDetallado',db]}
        ]

        if(year){
            activeScopes.push({method: ['delAño', year]})
        }

        const data= await Book.scope(activeScopes).findAndCountAll({
            where: Authorid ? {author_id: Authorid} : {},
            limit, offset,
          })

        const response = getPagingData(data,page,limit)
        res.json(response)    

    }catch(err){
        res.status(500).json({message:'Error al obtener los libros'})
    }
}


module.exports.getOne = async (req, res) => {
    try{
        const{id} = req.params
        const books = await Book.findByPk(id)
        if(!books) return res.status(404).json({message:'Book not found'})
        res.json(books)

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Error retrieving the book'})
    }
}

module.exports.create = async (req, res) => {
    try{
        console.log(req.body)
        const result = validateBook(req.body)
        console.log(result)
        if(!result.success) return res.status(400).json({error:JSON.parse(result.message.error)})
        const newBook = await Book.create(result.data)
        res.status(201).json(newBook)    

    }catch(err){
        res.status(500).json({message:'Error al crear el libro',err})
    }
}

module.exports.delete = async (req, res) => {
    try{
       const {id} = req.params
       const book = await Book.findByPk(id)
       if(!book) return res.status(404).json({message:'Book not found'})
       await book.destroy() 
       res.json({message:'Book deleted successfully'})
    }catch(err){
        res.status(500).json({message:'Error al eliminar el libro'})
    }
}


module.exports.update = async (req, res) => {
    try{
        const result = validatePartialBook(req.body)
        if(!result.success) return res.status(400).json({error:JSON.parse(result.error.message)})
        const {id} = req.params
        const books = await Book.findByPk(id)
        if(!books) return res.status(404).json({message:'Book not found'})
        await books.update(result.data)
        res.json(books)    
        
    }catch(err){
        res.status(500).json({message:'Error al actualizar el libro'})
    }
}
