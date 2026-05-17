import { gameService } from '../services/game.service.js'
import { cardService } from '../services/card.service.js'
import { gameState } from './gameState.js'

const queue = []

export function registerMatchmakingHandlers(io, socket) {

  socket.on('queue:join', async () => {
    if (queue.find(p => p.user.id === socket.user.id)) return

    queue.push({ socketId: socket.id, user: socket.user })
    socket.emit('queue:waiting', { position: queue.length })

    if (queue.length >= 2) {
      const player1 = queue.shift()
      const player2 = queue.shift()

      try {
        const game = await gameService.create(player1.user.id, player2.user.id)
        const hand1 = await cardService.dealHand(5)
        const hand2 = await cardService.dealHand(5)

        const roomId = game.id

        // Guardar estado en memoria
        gameState.create(roomId, player1.user, hand1, player2.user, hand2)

        const socket1 = io.sockets.sockets.get(player1.socketId)
        const socket2 = io.sockets.sockets.get(player2.socketId)

        socket1?.join(roomId)
        socket2?.join(roomId)

        socket1?.emit('game:start', {
          roomId,
          hand: hand1,
          opponent: { id: player2.user.id, username: player2.user.username },
        })

        socket2?.emit('game:start', {
          roomId,
          hand: hand2,
          opponent: { id: player1.user.id, username: player1.user.username },
        })

      } catch (err) {
        console.error('Error creando partida:', err.message)
        socket.emit('error', { message: 'Error al crear la partida' })
      }
    }
  })

  socket.on('queue:leave', () => {
    removeFromQueue(socket.user.id)
    socket.emit('queue:left')
  })

  socket.on('disconnect', () => {
    removeFromQueue(socket.user.id)
  })
}

function removeFromQueue(userId) {
  const index = queue.findIndex(p => p.user.id === userId)
  if (index !== -1) queue.splice(index, 1)
}