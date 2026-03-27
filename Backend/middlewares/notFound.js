//Es un middleware que se encarga de manejar las rutas que no existen, es decir, si el cliente hace una petición a una ruta que no existe, 
//el middleware se encargará de enviar una respuesta adecuada al cliente indicando que la ruta no fue encontrada.
const notFound = (req,res) => {
    res.status(404).json({error: `Ruta ${req.originalUrl} not found`})
}

module.exports = notFound