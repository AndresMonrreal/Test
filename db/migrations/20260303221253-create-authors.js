'use strict';
const {Author} = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //el queryInterface es un objeto que proporciona métodos para interactuar con la base de datos, como crear tablas, agregar columnas, etc. Sequelize es la biblioteca de ORM que se utiliza para definir los modelos y sus atributos.
  async up (queryInterface, Sequelize) { // Esta parte es para crear la tabla de authors, utilizando los atributos definidos en el modelo Author. Esto asegura que la estructura de la tabla sea consistente con el modelo definido en Sequelize.
    try{
      const Authorattributes = Author.getAttributes()// Esta parte es para obtener los atributos definidos en el modelo Author, lo que permite utilizar esos atributos para crear la tabla de authors en la base de datos. Esto asegura que la estructura de la tabla sea consistente con el modelo definido en Sequelize.
      await queryInterface.createTable('authors',{//Esta parte es para crear la tabla de authors, utilizando los atributos definidos en el modelo Author. Esto asegura que la estructura de la tabla sea consistente con el modelo definido en Sequelize.
        id:Authorattributes.id,// Esta parte es para definir la columna id en la tabla de authors, utilizando el atributo id definido en el modelo Author. Esto asegura que la estructura de la tabla sea consistente con el modelo definido en Sequelize.
        name:Authorattributes.name,
        nationality: Authorattributes.nationality,
        birthDay: Authorattributes.birthDay,
        createdAt: Authorattributes.createdAt,
        updatedAt: Authorattributes.updatedAt,

      })
    }catch(error){
      throw new error
    }
  },
  //el down es para eliminar la tabla de authors en caso de que se necesite revertir la migración. Esto es útil para mantener la integridad de la base de datos y permitir volver a un estado anterior si es necesario.
  async down (queryInterface, Sequelize) {
    try{
      await queryInterface.dropTable('authors')
    }catch(err){
      throw(err)
    }
  }
};
