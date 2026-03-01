const express = require('express')
const crypto = require('node:crypto') 
const cors = require('cors')
const db = require('./models');

//const books = requiere()
const app = express()

app.disable('x-powered-by') // Para deshabilitar el header X-Powered-By: Express
app.use(express.json())
const authorRoutes = require('./routes/authors-routes');
const bookRoutes = require('./routes/books-routes');

app.use(express.json());

app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);


const PORT = process.env.PORT ?? 4321 

db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Tablas sincronizadas en MySQL");
  })
  .catch(err => console.log("Error de sync:", err));
  
app.listen(PORT,()=>{
    console.log(`server listening on port http://localhost:${PORT}`)
})



