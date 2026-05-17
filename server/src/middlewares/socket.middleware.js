import jwt from 'jsonwebtoken'

export function socketAuthMiddleware(socket, next) {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Token requerido'))

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = payload // { id, username }
    next()
  } catch {
    next(new Error('Token inválido'))
  }
}