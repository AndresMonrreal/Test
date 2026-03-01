'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      // Aquí definirás asociaciones más adelante (ej. Author.hasMany(models.Book))
    }
  }
  Author.init({
    // IMPORTANTE: Los nombres de los campos deben ser igual a tu migración
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nationality: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Author', // <--- ESTO es lo que usas en el require
    tableName: 'authors', // <--- ESTO es el nombre de la tabla en MySQL
  });
  return Author;
};