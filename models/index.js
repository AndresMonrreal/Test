'use strict';

const fs = require('fs');        //Para que el código pueda "ver" qué archivos hay dentro de tu carpeta de modelos
const path = require('path');    // Para construir rutas de archivos y no existar problemas entre sistemas operativos (Windows, Linux, etc) con las barras de las rutas
const Sequelize = require('sequelize');  // El ORM
const process = require('process');     // Para leer variables de entorno
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; //Lee si estás en development, production o test. Si no está definido usa development.
//Abre tu config.json y toma el bloque correspondiente al entorno, o sea tus credenciales de MySQL
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;//Variable que va a contener la conexión a la base de datos
//Si tienes una variable de entorno con la URL completa la usa, sino usa usuario/contraseña/base de datos por separado
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config); // Si en tu config.json tienes algo como "use_env_variable": "DATABASE_URL", entonces esta línea va a leer la variable de entorno DATABASE_URL y usarla para conectarse a la base de datos. Esto es útil para producción donde no quieres poner tus credenciales directamente en el código.
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs  //Lee todos los archivos de la carpeta actual para no tener que escribir require('./Author') etc por cada modelo que tengas. Solo va a tomar los archivos .js que no sean este index.js ni archivos de test.
  .readdirSync(__dirname)
  .filter(file => { //Filtra los archivos (ignora tests y el propio index.js)
    return (
      file.indexOf('.') !== 0 && //Ignora archivos que empiecen con punto (como .gitignore)
      file !== basename &&       //Ignora este archivo index.js
      file.slice(-3) === '.js' && //Solo toma archivos que terminen en .js
      file.indexOf('.test.js') === -1 //Ignora archivos de test que terminen en .test.js
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); //Por cada archivo encontrado, "activa" el modelo
    db[model.name] = model; //Guarda el modelo en un objeto central 
  });
//Recorre todos los modelos cargados y si tienen una función "associate" (que es donde definimos las relaciones entre tablas) la ejecuta, pasándole el objeto con todos los modelos para que puedan relacionarse entre sí.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) { //Si el modelo tiene una función associate, la ejecuta para establecer las relaciones entre tablas
    db[modelName].associate(db); //Le pasa el objeto con todos los modelos para que puedan relacionarse entre sí
  }
});

db.sequelize = sequelize; //Guarda la instancia de Sequelize (la conexión a la base de datos) en el objeto db para que pueda ser usada en otras partes de la aplicación
db.Sequelize = Sequelize; //Guarda la clase Sequelize (el ORM) en el objeto db por si necesitas usarla para definir tipos de datos o hacer consultas avanzadas en otras partes de tu aplicación

module.exports = db; 
