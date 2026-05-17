import { gameState } from './gameState.js'
import { resolveRound, checkVictory } from '../game/engine.js'
import { gameService } from '../services/game.service.js'
import { userService } from '../services/user.service.js'
import { cardService } from '../services/card.service.js'

export function registerGameHandlers(io, socket) {

  socket.on('card:play', async ({ roomId, cardId }) => {
    const userId = socket.user.id
    const game = gameState.get(roomId)

    // Validaciones
    if (!game) return socket.emit('error', { message: 'Partida no encontrada' })
    if (!game.players[userId]) return socket.emit('error', { message: 'No estás en esta partida' })
    if (game.moves[userId]) return socket.emit('error', { message: 'Ya has jugado en este turno' })

    const player = game.players[userId]
    const card = player.hand.find(c => c.id === cardId)
    if (!card) return socket.emit('error', { message: 'Esa carta no está en tu mano' })

    // Registrar movimiento
    game.moves[userId] = card

    // Notificar al rival que ya jugaste (sin revelar la carta)
    socket.to(roomId).emit('opponent:played')

    // ¿Han jugado los dos?
    const playerIds = Object.keys(game.players)
    const bothPlayed = playerIds.every(id => game.moves[id])
    if (!bothPlayed) return

    // Resolver ronda
    const [id1, id2] = playerIds
    const cardA = game.moves[id1]
    const cardB = game.moves[id2]
    const result = resolveRound(cardA, cardB)

    // Determinar ganador de la ronda
    let roundWinnerId = null
    if (result.winner === 'A') roundWinnerId = id1
    if (result.winner === 'B') roundWinnerId = id2

    // Dar carta ganada al ganador
    if (roundWinnerId) {
      const winningCard = result.winner === 'A' ? cardA : cardB
      game.players[roundWinnerId].wonCards.push(winningCard)
    }

    // Quitar cartas jugadas de las manos
    game.players[id1].hand = game.players[id1].hand.filter(c => c.id !== cardA.id)
    game.players[id2].hand = game.players[id2].hand.filter(c => c.id !== cardB.id)

    // Guardar ronda en DB
    await gameService.saveRound(roomId, game.roundNumber, roundWinnerId)

    // Emitir resultado de ronda a los dos
    io.to(roomId).emit('round:result', {
      round: game.roundNumber,
      cards: {
        [id1]: cardA,
        [id2]: cardB,
      },
      winnerId: roundWinnerId,
      reason: result.reason,
      wonCards: {
        [id1]: game.players[id1].wonCards,
        [id2]: game.players[id2].wonCards,
      },
    })

    game.roundNumber++
    game.moves = {}

    // ¿Hay ganador de partida?
    for (const id of playerIds) {
      if (checkVictory(game.players[id].wonCards)) {
        const loserId = playerIds.find(p => p !== id)

        await gameService.finish(roomId, id)
        await userService.updateStats(id, loserId)

        io.to(roomId).emit('game:over', {
          winnerId: id,
          winnerUsername: game.players[id].user.username,
        })

        gameState.delete(roomId)
        return
      }
    }

    // Si alguno se quedó sin cartas, repartir más
    for (const id of playerIds) {
      if (game.players[id].hand.length === 0) {
        const newHand = await cardService.dealHand(3)
        game.players[id].hand = newHand

        const playerSocket = [...io.sockets.sockets.values()]
          .find(s => s.user?.id === id)
        playerSocket?.emit('hand:new', { hand: newHand })
      }
    }
  })

  socket.on('disconnect', async () => {
    const game = gameState.getByUserId(socket.user.id)
    if (!game) return

    const playerIds = Object.keys(game.players)
    const winnerId = playerIds.find(id => id !== socket.user.id)

    if (winnerId) {
      await gameService.finish(game.roomId, winnerId)
      await userService.updateStats(winnerId, socket.user.id)

      io.to(game.roomId).emit('game:over', {
        winnerId,
        winnerUsername: game.players[winnerId].user.username,
        reason: 'opponent_disconnected',
      })
    }

    gameState.delete(game.roomId)
  })
}