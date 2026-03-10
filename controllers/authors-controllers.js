
 //---------------------------------------------------------------------------------------------------//

const {Author} = require('../db/models')
const {validateAuthor,validateAuthorPartial} = require('../schemas/authors')

module.exports.findAll = async (req, res) => {
    try{
        const{nationality} = req.query
        if(nationality){
            const filteredAuthors = await Author.findAll({
                where:{nationality}
            })
            return res.json(filteredAuthors)
        }

        const authors = await Author.findAll()
        res.json(authors)
    }catch(err){
        res.status(500).json({message:'Error al obtener los autores'})
    }
}


module.exports.getOne =async (req, res) => {
    try{
        const {id} = req.params
        const author = await Author.findByPk(id)
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
        const newAuthor =  await Author.create(result.data)   //
    
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
        res.json(author)    
            

    }catch(err){
        res.status(500).json({message:'Error al actualizar el author'})
    }
}