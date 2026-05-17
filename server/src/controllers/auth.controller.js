import { authService } from '../services/auth.service.js'

export const authController = {
  register: async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password)
      return res.status(400).json({ error: 'Faltan campos obligatorios' })

    try {
      const user = await authService.register(username, email, password)
      res.status(201).json({ id: user.id, username: user.username })
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError')
        return res.status(409).json({ error: 'Username o email ya en uso' })
      res.status(500).json({ error: err.message })
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'Faltan campos obligatorios' })

    try {
      const data = await authService.login(email, password)
      res.json(data)
    } catch (err) {
      res.status(401).json({ error: err.message })
    }
  },

  me: async (req, res) => {
    // req.user viene del middleware, ya está autenticado
    res.json(req.user)
  },
}