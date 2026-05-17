import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Token requerido' })

  const token = header.split(' ')[1] // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Token mal formado' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}