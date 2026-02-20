
const authors =  require('../Json/authors.json')
const {validateAuthor,validateAuthorPartial} = require('../Schemas/authors')

module.exports.findAll = (req, res) =>{
   const {nacionality} = req.query
   if(nacionality){
    const filteredAuthors = authors.filter(
        author => author.nacionality.some(g => g.toLoweCase() === nacionality.toLoweCase())
    )
    return res.json(filteredAuthors)
   }
   res.json(authors)
}


module.exports.getOne = (req, res) =>{
    const {id} = req.params
    const author = authors.find(author => author.id === Number(id))
    if(author) return res.json(author)
    res.status(404).json({message :'Author no found'})   
}

module.exports.create = (req, res)=>{
    const result = validateAuthor(req.body)

    if(!result.success){
        return res.status(400).json({error:JSON.parse(result.error.message)})
    }

    const newAuthor = {
        id:crypto.randomUUID(),
        ...result.data //Para traerme todo de golpe y no estar escribiendo resul.name ....
    }

    authors.push(newAuthor)
    res.status(201).json(newAuthor)

}

module.exports.delete = (req,res)=> {
    const {id} = req.params
    const authordelete = authors.findIndex(author => author.id === id)
    if(authordelete === -1){
        return res.status(404).json({message:'Not found'})
    }

    authors.splice(authordelete,1) //Entra al arreglo de mis autores busca el donde y cuantos
    return res.json({message:'Author delete'})
}

module.exports.update = (req ,res) => {
    const result = validateAuthorPartial(req.body)
    if(!result.success){
        return res.status(400).json({error:JSON.parse(result.error.message)})
    }

    const{id} = req.params

    const author = authors.findIndex(author => author.id === id)
    if(author === -1){
        return res.status(404).json({message:'Not found'})
    }

    const updateAuthor = {
        ...authors[author],
        ...result.data
    }

    authors[author] = updateAuthor

    return res.json(updateAuthor)

}