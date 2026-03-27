//Sirve para manejar los errores de manera centralizada, es decir, en lugar de tener que manejar los errores en cada ruta o controlador, podemos tener un middleware que se encargue de manejar los errores de manera global
//De esta manera, si ocurre un error en cualquier parte de la aplicación, el middleware se encargará de capturarlo y enviar una respuesta adecuada al cliente.
const errorHandler = (err,req,res,next) => {
    //El statusCode es el código de estado HTTP que se va a enviar en la respuesta, si el error tiene un statusCode definido, se utiliza ese, de lo contrario, se utiliza el 500 que indica un error interno del servidor
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({error:err.message || 'Internal server Error'})
}

module.exports = errorHandler