const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const auth = req.headers['authorization']
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' })
  }
  
  try {
    const token = auth.slice(7)
    req.user = jwt.verify(token, process.env.SECRET_KEY)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
