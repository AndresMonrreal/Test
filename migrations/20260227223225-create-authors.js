'use strict';
////Sequelize necesita estas dos funciones para saber qué hacer al aplicar la migración (up) y qué hacer si decides deshacerla (down).
module.exports = {
  //Es el comando de "construcción". Se usa async porque las operaciones de BD toman tiempo.
  up: async (queryInterface, Sequelize) => { 
    await queryInterface.createTable('authors', {
      id: {
        allowNull: false, //Prohíbe que este campo esté vacío.
        autoIncrement: true, 
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false  
      },
      nationality: Sequelize.STRING,
      birthDate: Sequelize.DATEONLY,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  //Borra la tabla 'authors' si decides revertir la migración.
  //Ya que si nos equivocamos o queremos volver a un estado anterior, esta función se encargará de limpiar lo que hicimos en 'up'.
  down: async (queryInterface) => {
    await queryInterface.dropTable('authors');
  }
};
