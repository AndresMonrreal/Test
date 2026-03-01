// const authors = require('../json/authors.json')
// const {validateAuthor,validateAuthorPartial} = require('../schemas/authors')

// module.exports.findAll = (req, res) =>{
//    const {nacionality} = req.query
//    if(nacionality){
//     const filteredAuthors = authors.filter(author =>
//         author.nacionality.toLowerCase() === nacionality.toLowerCase()
//     )
//     return res.json(filteredAuthors)
//    }
//    res.json(authors)
// }


// module.exports.getOne = (req, res) =>{
//     const {id} = req.params
//     console.log(id)
//     const findid = authors.find(author => {
//         console.log(author)
//         return author.id == id
//     })
//     console.log(findid)
//     if(findid) return res.json(findid)
//     res.status(404).json({message :'Author no found'})   
// }

// module.exports.create = (req, res)=>{
//     const result = validateAuthor(req.body)

//     if(!result.success){
//         return res.status(400).json({error:JSON.parse(result.error.message)})
//     }

//     const newAuthor = {
//         id:crypto.randomUUID(),
//         ...result.data //Para traerme todo de golpe y no estar escribiendo resul.name ....
//     }

//     authors.push(newAuthor)
//     res.status(201).json(newAuthor)

// }

// module.exports.delete = (req,res)=> {
//     const {id} = req.params
//     const authordelete = authors.findIndex(author => author.id === id)
//     if(authordelete === -1){
//         return res.status(404).json({message:'Not found'})
//     }

//     authors.splice(authordelete,1) //Entra al arreglo de mis autores busca el donde y cuantos
//     return res.json({message:'Author delete'})
// }

// module.exports.update = (req ,res) => {
//     const result = validateAuthorPartial(req.body)
//     if(!result.success){
//         return res.status(400).json({error:JSON.parse(result.error.message)})
//     }

//     const{id} = req.params

//     const author = authors.findIndex(author => author.id == id)
//     if(author === -1){
//         return res.status(404).json({message:'Not found'})
//     }

//     const updateAuthor = {
//         ...authors[author], //Toma todas las propiedades
//         ...result.data   //Y pues este se trae todos los nuevos datos
//     }

//     authors[author] = updateAuthor

//     return res.json(updateAuthor)

// }



 //---------------------------------------------------------------------------------------------------//

const {Author} = require('../models')
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
        res.status(500).json({message:'Error al obtener los autores', err})
    }
}


module.exports.getOne =async (req, res) => {
    try{
        const {id} =req.params
        const author = await Author.findByPk(id)
        if(!author) return res.json({message: 'Author not found'})
        res.json(author)    

    }catch(err){
        res.status(500).json({message:'Error al obtener el author', err})
    }
}

module.exports.create = async (req, res) => {
    try{
        const result = validateAuthor(req.body)
        if(!result.success) return res.status(400).json({eror:JSON.parse(result.error.message)})
        const newAuthor =  await Author.create(result.data)   
    
        res.status(201).json(newAuthor)

    }catch(err){
        res.json({message:'Error al crear el author',err})
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
        res.status(500).json({message:'Error al eliminar el author',err})
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
        res.status(500).json({message:'Error al actualizar el author',err})
    }
}