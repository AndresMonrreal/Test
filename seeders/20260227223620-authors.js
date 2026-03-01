'use strict'; //Sequelize necesita estas dos funciones para saber qué hacer al aplicar la migración (up) y qué hacer si decides deshacerla (down).
const path = require('path'); //Para construir rutas de archivos y no existar problemas entre sistemas operativos (Windows, Linux, etc) con las barras de las rutas
const fs = require('fs'); //Para leer archivos del sistema, en este caso para leer el JSON con los datos de los autores que queremos insertar

module.exports = {
  up: async (queryInterface) => { //Define la función de carga de datos 
    const dataPath = path.join(__dirname, '../json/authors.json'); //Construye la ruta al archivo JSON con los datos de los autores. __dirname es la carpeta actual (migrations) y luego sube una carpeta y entra a json/authors.json
    const authors = JSON.parse(fs.readFileSync(dataPath, 'utf-8')); //Lee el archivo JSON y lo convierte a un objeto de JavaScript. Ahora "authors" es un arreglo con los datos de los autores que queremos insertar en la base de datos.
    
    //Agrega las columnas de createdAt y updatedAt a cada autor, ya que la tabla las requiere y no pueden ser nulas. Les asigna la fecha actual.
    const authorsWithTimestamps = authors.map(author => ({ //Por cada autor en el arreglo original, crea un nuevo objeto que tiene todas las propiedades del autor original (usando el spread operator ...author) y además agrega las propiedades createdAt y updatedAt con la fecha actual.
      ...author,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    //Inserta los autores con timestamps en la tabla 'authors' usando queryInterface.bulkInsert, que es una función de Sequelize para insertar múltiples registros a la vez.
    await queryInterface.bulkInsert('authors', authorsWithTimestamps);
  },
  down: async (queryInterface) => { //Define la función para deshacer la carga de datos, que en este caso borra todos los registros de la tabla 'authors' usando queryInterface.bulkDelete
  // El segundo parámetro null indica que no hay una condición específica para borrar, por lo que se borran todos los registros.
    await queryInterface.bulkDelete('authors', null, {}); // Esto solo si es que no equiovcamos en algun momento
  }
};