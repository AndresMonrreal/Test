# 1. Inicializar Sequelize
npx sequelize-cli init

# 2. Crear la base de datos
npx sequelize-cli db:create

# 3. Generar la migración
npx sequelize-cli migration:generate --name create-authors

# 4. Correr la migración (crea la tabla)
npx sequelize-cli db:migrate

# 5. Generar el seeder
npx sequelize-cli seed:generate --name authors

# 6. Correr el seeder (inserta los datos)
npx sequelize-cli db:seed:all


//Esto para cuando tenemos problemas con el duplicado
npx sequelize-cli db:seed:undo
npx sequelize-cli db:seed:all