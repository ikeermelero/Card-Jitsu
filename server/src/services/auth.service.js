import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {User} from '../models/index.js'

export const authService = {
  register: async (username, email, password) => {
    const password_hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password_hash })
    return user
  },

  login: async (email, password) => {
    const user = await User.findOne({ where: { email } })
    if (!user) throw new Error('Usuario no encontrado')

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) throw new Error('Contraseña incorrecta')

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { token, user: { id: user.id, username: user.username, elo: user.elo } }
  },
}