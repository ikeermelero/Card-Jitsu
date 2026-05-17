import {Card} from '../models/index.js'

export const cardService = {
  getAll: () => Card.findAll(),

  getById: (id) => Card.findByPk(id),

  // Para repartir mano aleatoria
  dealHand: async (size = 5) => {
    const all = await Card.findAll()
    return all.sort(() => Math.random() - 0.5).slice(0, size)
  },
}