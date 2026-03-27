const express = require('express')
const crypto = require('node:crypto') 
const cors = require('cors')
const PORT = process.env.PORT ?? 4321 
const app = express()
const middlewareNotFound = require('./middlewares/notFound.js')
const errorHandler = require('./middlewares/errorHandler.js')
const {sequelize} = require('./db/models/index.js')
app.disable('x-powered-by') // Para deshabilitar el header X-Powered-By: Express
app.use(express.json())
const authorRoutes = require('./routes/authors-routes');
const bookRoutes = require('./routes/books-routes');

app.use(express.json());
app.use(cors());

app.use('/authors', authorRoutes)
app.use('/books', bookRoutes)
app.use(middlewareNotFound)
app.use(errorHandler)

const connectDB = async ()=> {
  try{
    await sequelize.authenticate()
    console.log('Conexion establecida exitosamente a la base de datos')
  }catch(err){
    console.error('Error al conectar a la base de datos:',err)
  }

}

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}` )
    console.log('Socket.IO inicializado correctamente')
  })
}

startServer().catch((err) => {
  console.log('Error al iniciar el servidor: ',err)
  process.exit(1)
})
