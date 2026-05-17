
import {User} from '../models/index.js'

export const userService = {
  create: (username, email, password_hash) =>
    User.create({ username, email, password_hash }),

  findByEmail: (email) =>
    User.findOne({ where: { email } }),

  findByUsername: (username) =>
    User.findOne({ where: { username } }),

  findById: (id) =>
    User.findByPk(id),

  updateStats: async (winnerId, loserId) => {
    await User.increment({ wins: 1, elo: 25 }, { where: { id: winnerId } })
    await User.decrement({ losses: -1 }, { where: { id: loserId } }) // losses + 1
    await User.sequelize.query(
      `UPDATE users SET elo = GREATEST(elo - 25, 0) WHERE id = :id`,
      { replacements: { id: loserId } }
    )
  },

  getRanking: () =>
    User.findAll({
      attributes: ['id', 'username', 'elo', 'wins', 'losses'],
      order: [['elo', 'DESC']],
      limit: 50,
    }),
}