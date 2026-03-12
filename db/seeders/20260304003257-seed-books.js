'use strict';//Esto es para indicar que el código debe ejecutarse en modo estricto, lo que ayuda a prevenir errores comunes y a mejorar la seguridad del código.
const fs = require('fs')//El módulo 'fs' (file system) de Node.js se utiliza para interactuar con el sistema de archivos, permitiendo leer y escribir archivos.
const path = require('path')//El módulo 'path' de Node.js proporciona utilidades para trabajar con rutas de archivos y directorios, facilitando la manipulación de rutas de manera segura y compatible con diferentes sistemas operativos.

/** @type {import('sequelize-cli').Migration} */ //Esto es un comentario de tipo que indica que el módulo exporta una migración de Sequelize, lo que ayuda a los editores de código a proporcionar autocompletado y validación de tipos para las funciones 'up' y 'down' que se definen a continuación.
module.exports = {
  async up (queryInterface, Sequelize) {//La función 'up' se ejecuta cuando se aplica la migración y se utiliza para realizar cambios en la base de datos, como crear tablas o insertar datos. En este caso, se está leyendo un archivo JSON que contiene información sobre libros, formateando los datos y luego insertándolos en la tabla 'books' de la base de datos utilizando el método 'bulkInsert' de Sequelize.
    const books = JSON.parse(fs.readFileSync(path.join(__dirname,'../../json/books.json')))//Aquí se está leyendo el archivo 'books.json' ubicado en la carpeta 'json' (dos niveles por encima del directorio actual) utilizando 'fs.readFileSync' para leer el contenido del archivo de manera síncrona, y luego se está parseando el contenido JSON utilizando 'JSON.parse' para convertirlo en un objeto JavaScript que se puede manipular en el código.
    const formattedBooks = books.map( book => ({//Aquí se está utilizando el método 'map' para iterar sobre cada libro en el array 'books' y formatear los datos de cada libro en un nuevo objeto que se ajusta a la estructura esperada por la base de datos. Cada objeto formateado incluye las propiedades 'id', 'title', 'description', 'published_year', 'author_id', 'created_At' y 'updated_at', que corresponden a las columnas de la tabla 'books' en la base de datos.
      id: book.id,//Aquí se está asignando el valor de 'id' del libro original al nuevo objeto formateado, lo que asegura que cada libro tenga un identificador único en la base de datos.
      title: book.title,//Aquí se está asignando el valor de 'title' del libro original al nuevo objeto formateado, lo que representa el título del libro en la base de datos.
      description: book.description,//Aquí se está asignando el valor de 'description' del libro original al nuevo objeto formateado, lo que representa la descripción del libro en la base de datos.
      published_year: book.publishedYear,//Aquí se está asignando el valor de 'publishedYear' del libro original al nuevo objeto formateado, lo que representa el año de publicación del libro en la base de datos.
      author_id:book.authorId,//Aquí se está asignando el valor de 'authorId' del libro original al nuevo objeto formateado, lo que representa el identificador del autor asociado con el libro en la base de datos.
      created_at:new Date(),
      updated_at: new Date()

    }))
    await queryInterface.bulkInsert('books',formattedBooks)//Aquí se está utilizando el método 'bulkInsert' de Sequelize para insertar múltiples registros en la tabla 'books' de la base de datos. El primer argumento es el nombre de la tabla ('books'), y el segundo argumento es el array de objetos formateados ('formattedBooks') que se van a insertar en la tabla. Este método permite insertar varios registros de una sola vez, lo que es más eficiente que insertar cada registro individualmente.
  },

  async down (queryInterface, Sequelize) {//La función 'down' se ejecuta cuando se revierte la migración y se utiliza para deshacer los cambios realizados por la función 'up'. En este caso, se está utilizando el método 'bulkDelete' de Sequelize para eliminar todos los registros de la tabla 'books', lo que revierte la inserción realizada en la función 'up'.
    await queryInterface.bulkDelete('books',null,{})//Aquí se está utilizando el método 'bulkDelete' de Sequelize para eliminar registros de la tabla 'books'. El primer argumento es el nombre de la tabla ('books'), el segundo argumento es 'null' para indicar que no se están especificando condiciones para eliminar registros específicos, y el tercer argumento es un objeto vacío '{}' que se utiliza para opciones adicionales (en este caso, no se están proporcionando opciones adicionales). Esto eliminará todos los registros de la tabla 'books', lo que revierte la inserción realizada en la función 'up'.
  }
};
