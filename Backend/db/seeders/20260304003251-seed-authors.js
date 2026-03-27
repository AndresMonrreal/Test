'use strict';
const fs = require('fs')
const path = require('path');
const { BULKDELETE } = require('sequelize/lib/query-types');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const authors = JSON.parse(fs.readFileSync(path.join(__dirname,'../../json/authors.json')))
    const formattedAuthors = authors.map(author => ({
      id: author.id,
      name: author.name,
      nationality: author.nationality,
      birth_day: author.birthDay,
      created_at: new Date(),
      updated_at: new Date()

    }))
    await queryInterface.bulkInsert('authors', formattedAuthors)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('authors',null,{})
  }
};
