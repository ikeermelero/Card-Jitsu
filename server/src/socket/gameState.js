const games = new Map()

export const gameState = {
  create: (roomId, player1, hand1, player2, hand2) => {
    games.set(roomId, {
      roomId,
      players: {
        [player1.id]: { user: player1, hand: hand1, wonCards: [] },
        [player2.id]: { user: player2, hand: hand2, wonCards: [] },
      },
      moves: {},       // { [userId]: card }
      roundNumber: 1,
    })
  },

  get: (roomId) => games.get(roomId),

  delete: (roomId) => games.delete(roomId),

  getByUserId: (userId) => {
    for (const game of games.values()) {
      if (game.players[userId]) return game
    }
    return null
  },
}