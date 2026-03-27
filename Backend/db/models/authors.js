const {Model} = require('sequelize')//Aquí se está importando la clase 'Model' del módulo 'sequelize', lo que permite definir un modelo de datos para la entidad 'Author' en la base de datos utilizando Sequelize, un ORM (Object-Relational Mapping) para Node.js.
const {Op} = require('sequelize')
module.exports = (sequelize, DataTypes) => {//Aquí se está exportando una función que define el modelo 'Author' utilizando Sequelize. La función recibe dos argumentos: 'sequelize', que es la instancia de Sequelize que se utiliza para interactuar con la base de datos, y 'DataTypes', que es un objeto que contiene los tipos de datos disponibles en Sequelize para definir las columnas de la tabla 'authors' en la base de datos.
    class Author extends Model{//Aquí se está definiendo una clase 'Author' que extiende la clase 'Model' de Sequelize, lo que permite definir un modelo de datos para la entidad 'Author' en la base de datos. La clase incluye un método estático 'associate' que se utiliza para definir las asociaciones entre el modelo 'Author' y otros modelos en la base de datos.
        static associate(models){//Aquí se está definiendo el método estático 'associate' dentro de la clase 'Author', que se utiliza para establecer las asociaciones entre el modelo 'Author' y otros modelos en la base de datos. En este caso, se está estableciendo una relación de uno a muchos entre 'Author' y 'Book', indicando que un autor puede tener muchos libros asociados.
           //Aquí se está utilizando el método 'hasMany' de Sequelize para establecer una relación de uno a muchos entre el modelo 'Author' y el modelo 'Book'. El primer argumento es el modelo 'Book', el segundo argumento es un objeto que especifica la clave foránea ('foreignKey') que se utilizará para establecer la relación en la base de datos, y el tercer argumento es un alias ('as') que se utilizará para referirse a esta asociación en el código. Esto permite que cada instancia de 'Author' tenga una propiedad 'Books' que contenga todos los libros asociados con ese autor.
            Author.hasMany(models.Book, {foreignKey:'authorId', as: 'Books'})
        }
    }
    Author.init({//Aquí se está utilizando el método 'init' de Sequelize para definir las columnas de la tabla 'authors' en la base de datos. El primer argumento es un objeto que define las columnas y sus tipos de datos, y el segundo argumento es un objeto que contiene opciones adicionales para el modelo, como la instancia de Sequelize, el nombre de la tabla, y configuraciones para los timestamps y el formato de los nombres de las columnas.
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDay: {
            type: DataTypes.DATEONLY,
            field: 'birth_day',//Aquí se está definiendo una columna 'birthDay' en el modelo 'Author' que se corresponde con la columna 'birth_day' en la tabla 'authors' de la base de datos. El tipo de dato es 'DATEONLY', lo que indica que esta columna almacenará solo la fecha (sin la hora), y se ha especificado 'allowNull: false' para indicar que esta columna no puede contener valores nulos, lo que significa que cada autor debe tener una fecha de nacimiento válida.
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'authors',
        timestamps: true,
        underscored: true,
        
        scopes:{
               novedades:{
                order: [['birth_day','DESC']]
            },
            conLibros(Models){
                return {
                    include:[{
                        model:Models.Book,
                        atributes:['id','name'],
                        as: 'Books'
                    }]
                }
            },
            nacionalidad(nacionalidad) {
                return {
                    where:{nationality: nacionalidad}
                }
            },
            search(query){
                return{
                    where:{
                        name: {[Op.like]:`%${query}%`}
                    }
                }
            }
        }
    }
)
return Author
}