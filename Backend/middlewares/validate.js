//Es un middleware que se encarga de validar los datos que se reciben en las peticiones
//utilizando una función de validación que se le pasa como parámetro
const validate = (validateFn) =>(req,res,next) =>{
    const result = validateFn(req.body)
    if(!result.success) {
        return res.status(400).json({
            errors: result.error.flatten().fieldErrors //El flatten es para aplanar el objeto de errores, ya que el error que devuelve zod es un objeto con una propiedad 
            // fieldErrors que contiene los errores de cada campo, y el flatten lo que hace es aplanar ese objeto para que sea más fácil de manejar en el cliente
        })
    }
    //Aqui mando los datos validados al siguiente middleware o controlador, ya que el resultado de la validación es un objeto con una propiedad data que contiene los datos validados, y se lo asigno a req.body para que el siguiente middleware o controlador pueda acceder a esos datos validados
    req.body = result.data
    next()
}

module.exports = validate