'use strict';
const {Book} = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      const Bookattributes = Book.getAttributes()
      await queryInterface.createTable('books',{
        id: Bookattributes.id,
        title: Bookattributes.title,
        description: Bookattributes.description,
        publishedYear: Bookattributes.publishedYear,
        authorId: Bookattributes.authorId,
        createdAt: Bookattributes.createdAt,
        updatedAt: Bookattributes.updatedAt,
      })
    }catch(error){
      throw error
    }
  },
//el down es para eliminar la tabla de books en caso de que se necesite revertir la migración. Esto es útil para mantener la integridad de la base de datos y permitir volver a un estado anterior si es necesario.
  async down (queryInterface, Sequelize) {
   try{
    await queryInterface.dropTable('books')
   }catch(err){
    throw err
   }
  }
};
