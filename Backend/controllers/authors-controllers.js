
 //---------------------------------------------------------------------------------------------------//
const db = require('../db/models')
const {Author} = db
const {getPagination, getPaginData} = require('../utils/pagination')
const {searchAuthors} = require('../service/authorService')

module.exports.findAll = async (req, res,next) => {
    try{
        //throw new Error('Error de prueba') 

        const{nacionalidad,size,page,nombre} = req.query
        const{limit,offset} = getPagination(page,size)

        const activeScopes = [
            'novedades',
            {method: ['conLibros',db]}
        ]   

        if(nacionalidad){
            activeScopes.push({method: ['nacionalidad',nacionalidad]})
        }

        if(nombre){
            activeScopes.push({method: ['search',nombre]})
        }

        const data = await Author.scope(activeScopes).findAndCountAll({
            limit,offset,
            distinct: true,
            col:'Author.id'
        })
        
        const response = getPaginData(data,page,limit)
        res.json(response)
    }catch(err){
        next(err) //modifica esto para pasar el error al middleware de manejo de errores
        //res.status(500).json({message:'Error al obtener los autores'})
    }
}


module.exports.getOne =async (req, res,next) => {
    try{
        const {id} = req.params
        const author = await Author.scope({method:['conLibros',db]}).findByPk(id)
        if(!author) return res.status(404).json({message: 'Author not found'})
        res.json(author)    

    }catch(err){
        next(err)
    }
}

module.exports.create = async (req, res,next) => {
    try{
        const newAuthor =  await Author.create(req.body)
        await newAuthor.reload({scope:{method:['conLibros',db]}})
    
        res.status(201).json(newAuthor)

    }catch(err){
        next(err)
    }
}

module.exports.delete = async (req,res,next) => {
    try{
        const {id} = req.params
        const author = await Author.findByPk(id)
        if(!author) return res.status(404).json({message:'AUthor not found'})
        await author.destroy()
        res.json({message:'Author delete'})   

    }catch(err){
        next(err)
    }
}
    

module.exports.update = async (req,res,next) => {
    try{
        const {id} = req.params
        const author = await Author.findByPk(id)
        if(!author) return res.status(404).json({message:'Author not found'})
        await author.update(req.body)
        await author.reload({scope:{method:['conLibros',db]}})
        res.json(author)    
            

    }catch(err){
        next(err)
    }
}

module.exports.error = async (req,res,next) => {
    const error = new Error('Error de prueba')
    error.statusCode = 404
    next(error)
}

module.exports.search = async (req,res,next) => {
    try{
        const {nombre} = req.query
        const result = await searchAuthors(nombre)
        res.json(result)
    }catch(err){
        next(err)
    }
}