const authService = require('../service/authService')

// POST /auth/register
module.exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const result = await authService.register(email, password)
        res.status(201).json(result)
    } catch (err) {
        next(err)
    }
}

// POST /auth/login
module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const result = await authService.login(email, password)
        res.json(result)
    } catch (err) {
        next(err)
    }
}

// GET /auth/me (protegida con authGuard)
module.exports.getMe = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await authService.getMe(userId)
        res.json(user)
    } catch (err) {
        next(err)
    }
}
