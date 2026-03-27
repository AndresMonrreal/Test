const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        static associate(models){
            // Sin asociaciones por ahora
        }
    }
    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true
    }
)
return User
}
