
 //---------------------------------------------------------------------------------------------------//
const db = require('../db/models')
const {Author} = db
const {getPagination, getPaginData} = require('../utils/pagination')
const {validateAuthor,validateAuthorPartial} = require('../schemas/authors')

module.exports.findAll = async (req, res) => {
    try{
        const{nacionalidad,size,page} = req.query
        const{limit,offset} = getPagination(page,size)
        
        const activeScopes = [
            'novedades',
            {method: ['conLibros',db]}
        ]   

        if(nacionalidad){
            activeScopes.push({method: ['nacionalidad',nacionalidad]})
        }
        const data = await Author.scope(activeScopes).findAndCountAll({
            limit,offset,
            distinct: true,
            col:'Author.id'
        })
        const response = getPaginData(data,page,limit)
        res.json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Error al obtener los autores'})
    }
}


module.exports.getOne =async (req, res) => {
    try{
        const {id} = req.params
        const author = await Author.scope({method:['conLibros',db]}).findByPk(id)
        if(!author) return res.status(404).json({message: 'Author not found'})
        res.json(author)    

    }catch(err){
        res.status(500).json({message:'Error al obtener el author'})
    }
}

module.exports.create = async (req, res) => {
    try{
        console.log(req.body)
        const result = validateAuthor(req.body)
        
        if(!result.success) return res.status(400).json({eror:JSON.parse(result.error.message)})
        const newAuthor =  await Author.create(result.data)
        await newAuthor.reload({scope:{method:['conLibros'],db}})
    
        res.status(201).json(newAuthor)

    }catch(err){
        res.status(500).json({message:'Error al crear el author',err})
    }
}

module.exports.delete = async (req,res) => {
    try{
        const {id} = req.params
        const author = await Author.findByPk(id)
        if(!author) return res.status(404).json({message:'AUthor not found'})
        await author.destroy()
        res.json({message:'Author delete'})   

    }catch(err){
        res.status(500).json({message:'Error al eliminar el author'})
    }
}
    

module.exports.update = async (req,res) => {
    try{
        const result = validateAuthorPartial(req.body)
        if(!result.success) return res.status(400).json({error:JSON.parse(result.error.message)})
        const {id} = req.params
        const author = await Author.findByPk(id)
        if(!author) return res.status(404).json({message:'Author not found'})

        await author.update(result.data)
        await author.reload({scope:{methos:['conLibros',db]}})
        res.json(author)    
            

    }catch(err){
        res.status(500).json({message:'Error al actualizar el author'})
    }
}