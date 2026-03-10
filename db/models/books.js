const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Book extends Model{
        static associate(models){
            Book.belongsTo(models.Author, {foreignKey: 'authorId' , as: 'Author'})
        }
    }
    Book.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false
        },
        publishedYear:{
            type: DataTypes.INTEGER,
            field: 'published_year',
            allowNnull: false
        },
        authorId: {
            type: DataTypes.INTEGER,
            field: 'author_id',
            references:{
                model: 'authors',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'books',
        timestamps: true,
        underscored: true,

        scopes: {
            novedades: {
                order: [['published_year','DESC']]
            },
            conAuthorDetallado(Models) {
                return {
                    include:[{
                        model: Models.Author,
                        attributes: ['id','name']
                    }]
                }
            },
            delAño(year){
                return {
                    where: {publishedYear: year     }
                }
            }
        }
    })
return Book
}

