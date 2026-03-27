const {Book} = require('../db/models')//Aquí se está importando el objeto 'Op' y el modelo 'Book' desde el módulo '../db/models'. El objeto 'Op' se utiliza para realizar operaciones de comparación en las consultas de Sequelize, mientras que el modelo 'Book' representa la tabla 'books' en la base de datos y se utiliza para interactuar con los datos de los libros.
const {Op} = require('sequelize')
module.exports.searchBooks = async (query) => {
    return await Book.findAll({
        where:{
            title: {[Op.like]:`%${query}%`}
        }
    })
}