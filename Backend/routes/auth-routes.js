const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth-controllers')
const { validateAuth } = require('../schemas/auth')
const validate = require('../middlewares/validate')
const authGuard = require('../middlewares/authGuard')

// Rutas públicas
router.post('/register', validate(validateAuth), authController.register)
router.post('/login', validate(validateAuth), authController.login)

// Rutas protegidas
router.get('/me', authGuard, authController.getMe)

module.exports = router
