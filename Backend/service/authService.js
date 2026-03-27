const {User} = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Registrar nuevo usuario
module.exports.register = async (email, password) => {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
        const err = new Error('El email ya está registrado')
        err.statusCode = 400
        throw err
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await User.create({
        email,
        password: hashedPassword
    })

    // Generar token JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    return { token, user: { id: user.id, email: user.email } }
}

// Login de usuario
module.exports.login = async (email, password) => {
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } })
    if (!user) {
        const err = new Error('Credenciales inválidas')
        err.statusCode = 401
        throw err
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        const err = new Error('Credenciales inválidas')
        err.statusCode = 401
        throw err
    }

    // Generar token JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    return { token, user: { id: user.id, email: user.email } }
}

// Obtener usuario actual (para rutas protegidas)
module.exports.getMe = async (userId) => {
    const user = await User.findByPk(userId)
    if (!user) {
        const err = new Error('Usuario no encontrado')
        err.statusCode = 404
        throw err
    }
    return { id: user.id, email: user.email }
}
