'use strict';
const {User} = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      const UserAttributes = User.getAttributes()
      await queryInterface.createTable('users',{
        id: UserAttributes.id,
        email: UserAttributes.email,
        password: UserAttributes.password,
        createdAt: UserAttributes.createdAt,
        updatedAt: UserAttributes.updatedAt,
      })
    }catch(error){
      throw new error
    }
  },

  async down (queryInterface, Sequelize) {
    try{
      await queryInterface.dropTable('users')
    }catch(err){
      throw(err)
    }
  }
};
