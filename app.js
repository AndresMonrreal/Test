const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')

//const books = requiere()
const app = express()

app.disable('x-powered-by') // Para deshabilitar el header X-Powered-By: Express
app.use(express.json())
const authorController = require('./controllers/authors-controllers')
const bookController = require('./controllers/books-controllers')

app.get('/authors', authorController.findAll)

app.get('/authors/:id',authorController.getOne)

app.post('/authors', authorController.create)

app.delete('/authors/:id',authorController.delete)

app.patch('/authors/:id',authorController.update)

app.get('/books', bookController.findAll)

app.get('/books/:id', bookController.getOne)

app.post('/books', bookController.create)

app.patch('/books/:id', bookController.update)

app.delete('/books/:id', bookController.delete)


const PORT = process.env.PORT ?? 4321

app.listen(PORT,()=>{
    console.log(`server listening on port http://localhost:${PORT}`)
})



