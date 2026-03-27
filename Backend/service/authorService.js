const {Author} = require('../db/models')//Aquí se está importando el objeto 'Op' y el modelo 'authors' desde el módulo '../db/models'. El objeto 'Op' se utiliza para realizar operaciones de comparación en las consultas de Sequelize, mientras que el modelo 'authors' representa la tabla 'authors' en la base de datos y se utiliza para interactuar con los datos de los autores.
const {Op} = require('sequelize')

module.exports.searchAuthors = async (query) => {
    return await Author.findAll({
        where: {
            name: {[Op.like]:`%${query}%`}
        }
    })
}