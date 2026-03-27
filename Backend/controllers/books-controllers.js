
const { file } = require('zod')
const db =  require('../db/models')
const {Book} = db
const {getPagination, getPaginData} = require('../utils/pagination')
const {searchBooks} = require('../service/bookService')

module.exports.findAll = async (req, res,next) => {
    try{
        const {page,size,year,Authorid,title} = req.query
        const {limit, offset} = getPagination(page,size)

        const activeScopes = [
            'novedades',
            {method: ['conAuthorDetallado',db]}
        ]

        if(year){
            activeScopes.push({method: ['delAño', year]})
        }

        if(title){
            activeScopes.push({method: ['search', title]})
        }

        const data= await Book.scope(activeScopes).findAndCountAll({
            //Si hay authorId Va filtrando por ese si no trae todo
            where: Authorid ? {author_id: Authorid} : {},
            limit, offset, 
            distinct: true, //Para evitar contar duplicados en muchos a muchos
            col:'Book.id' //Indica sobre que columna contar en la paginacion
          })

        const response = getPaginData(data,page,limit)
        res.json(response)    

    }catch(err){
        next(err)
        //console.log(err)
        //res.status(500).json({message:'Error al obtener los libros'})
    }
}


module.exports.getOne = async (req, res,next) => {
    try{
        const{id} = req.params
        const books = await Book.scope({method: ['conAuthorDetallado', db]}).findByPk(id)
        if(!books) return res.status(404).json({message:'Book not found'})
        res.json(books)

    }catch(err){
        next(err)
        //console.log(err)
        //res.status(500).json({message:'Error retrieving the book'})
    }
}

module.exports.create = async (req, res,next) => {
    try{
        const newBook = await Book.create(req.body)
        await newBook.reload({scope:{method: ['conAuthorDetallado',db]}})
        res.status(201).json(newBook)    

    }catch(err){
        next(err)
        //res.status(500).json({message:'Error al crear el libro',err})
    }
}

module.exports.delete = async (req, res,next) => {
    try{
       const {id} = req.params
       const book = await Book.findByPk(id)
       if(!book) return res.status(404).json({message:'Book not found'})
       await book.destroy() 
       res.json({message:'Book deleted successfully'})
    }catch(err){
        next(err)
        //res.status(500).json({message:'Error al eliminar el libro'})
    }
}


module.exports.update = async (req, res,next) => {
    try{
        const {id} = req.params
        const books = await Book.findByPk(id)
        if(!books) return res.status(404).json({message:'Book not found'})
        await books.update(req.body)
        await books.reload({scope:{method:'conAuthorDetllado',db}})
        res.json(books)    
        
    }catch(err){
        next(err)
        //res.status(500).json({message:'Error al actualizar el libro'})
    }
}

module.exports.search = async (req,res,next) => {
    try{
        const {title} = req.query
        const result = await searchBooks(title)
        res.json(result)
    }catch(err){
        next(err)
    }
}