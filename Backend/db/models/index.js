'use strict'; // Este archivo se encarga de cargar todos los modelos de la carpeta "models" y establecer las asociaciones entre ellos. También configura la conexión a la base de datos utilizando Sequelize.

const fs = require('fs');// El módulo "fs" se utiliza para leer los archivos de la carpeta "models".
const path = require('path');// El módulo "path" se utiliza para manejar las rutas de los archivos de manera más fácil y segura.
const Sequelize = require('sequelize');// Sequelize es el ORM que se utiliza para interactuar con la base de datos. Permite definir modelos, realizar consultas y manejar asociaciones entre tablas de manera sencilla.
const process = require('process');// El módulo "process" se utiliza para acceder a las variables de entorno, como "NODE_ENV", que indica el entorno de ejecución (desarrollo, producción, etc.).
const basename = path.basename(__filename);// "basename" almacena el nombre del archivo actual (index.js) para evitar cargarlo como un modelo.
const env = process.env.NODE_ENV || 'development';// "env" almacena el entorno de ejecución actual, que se obtiene de la variable de entorno "NODE_ENV". Si no está definida, se asume que es "development".
const config = require(__dirname + '/../config/config.json')[env];// "config" carga la configuración de la base de datos desde el archivo "config.json" según el entorno de ejecución actual. Este archivo contiene las credenciales y detalles de conexión para diferentes entornos (desarrollo, producción, etc.).
const db = {};// "db" es un objeto que se utilizará para almacenar los modelos cargados y la instancia de Sequelize.

let sequelize;// "sequelize" es la instancia de Sequelize que se utilizará para interactuar con la base de datos. Se inicializa a continuación según la configuración cargada.
if (config.use_env_variable) {// Si la configuración especifica una variable de entorno para la conexión a la base de datos, se utiliza esa variable para inicializar Sequelize. Esto es útil para entornos de producción donde las credenciales no se almacenan directamente en el código.
  sequelize = new Sequelize(process.env[config.use_env_variable], config);// Se inicializa Sequelize utilizando la variable de entorno especificada en la configuración.
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);// Si no se especifica una variable de entorno, se inicializa Sequelize utilizando los detalles de conexión proporcionados directamente en la configuración (nombre de la base de datos, usuario, contraseña, etc.).
}

fs
  .readdirSync(__dirname)// "fs.readdirSync(__dirname)" lee de manera síncrona el contenido de la carpeta actual (donde se encuentra este archivo index.js) y devuelve una lista de los archivos presentes en esa carpeta.
  .filter(file => {// El método "filter" se utiliza para filtrar la lista de archivos y seleccionar solo aquellos que cumplen ciertas condiciones. En este caso, se seleccionan los archivos que:
    return (
      file.indexOf('.') !== 0 && // No comienzan con un punto (esto excluye archivos ocultos).
      file !== basename && // No son el archivo index.js (para evitar cargar este archivo como un modelo).
      file.slice(-3) === '.js' && // Terminan con la extensión .js (para asegurarse de cargar solo archivos JavaScript).
      file.indexOf('.test.js') === -1 // No contienen ".test.js" en su nombre (para excluir archivos de prueba).
    );
  })
  .forEach(file => {// El método "forEach" se utiliza para iterar sobre la lista de archivos filtrados y cargar cada uno como un modelo de Sequelize. Para cada archivo:
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);// Se requiere el archivo del modelo utilizando "require" y se le pasa la instancia de Sequelize y los tipos de datos de Sequelize. Esto permite que el modelo se defina correctamente con la conexión a la base de datos.
    db[model.name] = model;// El modelo cargado se almacena en el objeto "db" utilizando el nombre del modelo como clave. Esto permite acceder a los modelos de manera fácil a través del objeto "db".
  });
console.log('Modelos en db:', Object.keys(db));
Object.keys(db).forEach(modelName => {// Después de cargar todos los modelos, se itera sobre las claves del objeto "db" (que son los nombres de los modelos) para establecer las asociaciones entre ellos. Si un modelo tiene una función "associate", se llama a esa función y se le pasa el objeto "db" para que pueda establecer las relaciones con otros modelos.
  if (db[modelName].associate) {// Si el modelo tiene una función "associate", se llama a esa función y se le pasa el objeto "db" para que pueda establecer las relaciones con otros modelos.
    db[modelName].associate(db);// Esto permite que los modelos definan sus asociaciones (como relaciones de uno a muchos, muchos a muchos, etc.) de manera centralizada en sus archivos de modelo, manteniendo el código organizado y fácil de mantener.
  }
});

db.sequelize = sequelize;// Se agrega la instancia de Sequelize al objeto "db" para que pueda ser utilizada en otras partes de la aplicación para realizar consultas a la base de datos, sincronizar modelos, etc.
db.Sequelize = Sequelize;// Se agrega la clase Sequelize al objeto "db" para que pueda ser utilizada en otras partes de la aplicación para acceder a los tipos de datos de Sequelize, funciones de utilidad, etc.

module.exports = db;// Finalmente, se exporta el objeto "db" que contiene todos los modelos cargados y la instancia de Sequelize. Esto permite que otros archivos de la aplicación puedan importar este módulo y acceder a los modelos y la conexión a la base de datos de manera sencilla.
