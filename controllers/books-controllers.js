
const books = require('../json/books.json')

const {validateBook,validatePartialBook} = require('../schemas/book')

module.exports.findAll = (req, res)=>{
    const {Authorid} = req.query
    if(Authorid){
        const filteredbook = books.filter(book => book.Authorid.some(g => g.toLowerCase() === Authorid.toLowerCase()))
       return res.json(filteredbook)
    }
     return res.json(books)  
}

module.exports.getOne = (req,res) => {
    const {id} = req.params
    const findid = books.find(book => book.id === id)
    if(findid) return res.json(findid)

    res.status(404).json({message:'Not found'})

}

module.exports.create = (req, res) => {
    const result = validateBook(req.body)

    if(!result.success){
        return res.status(400).json({error:JSON.parse(result.error.message)})
    }

    const newBook = {
        id:crypto.randomUUID(),
        ...result.data
    }

    books.push(newBook)
    res.status(201).json(newBook)

}

module.exports.delete = (req,res) => {
    const {id} = req.params
    const bookdelete = books.findIndex(book => book.id === id)

    if(bookdelete == -1){
        return res.status(404).json('Not found')
    }

    books.splice(bookdelete,1)
    res.json({message:'Book delete'})

}

module.exports.update = (req,res) => {
    const result = validatePartialBook(req.body)

    if(!result.success){
        return res.status(401).json({error:JSON.parse(result.error.message)})
    }

    const {id} = req.params
    const bookfind = books.findIndex(book => book.id === id )

    if(bookfind === -1){
        return res.status(404).json('Not found')
    }

    const updateBook = {
        ...books[bookfind],
        ...result.data
    }

    books[bookfind] = updateBook
    res.json(updateBook)
}



