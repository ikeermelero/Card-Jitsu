import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getSocket } from '../socket/socket.js'

export default function Game() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const gameData = JSON.parse(sessionStorage.getItem('gameData') || '{}')
  console.log('gameData:', gameData)
  console.log('hand:', gameData.hand)

  const [hand, setHand] = useState(gameData.hand || [])
  const [wonCards, setWonCards] = useState([])
  const [opponentWonCards, setOpponentWonCards] = useState([])
  const [status, setStatus] = useState('playing') // playing | waiting | over
  const [lastRound, setLastRound] = useState(null)
  const [gameOver, setGameOver] = useState(null)

  useEffect(() => {
    const socket = getSocket(token)

    socket.on('opponent:played', () => setStatus('waiting'))

    socket.on('round:result', (data) => {
      setLastRound(data)
      setStatus('playing')

      const myWon = data.wonCards[user.id] || []
      const oppId = Object.keys(data.wonCards).find(id => id !== user.id)
      const oppWon = data.wonCards[oppId] || []

      setWonCards(myWon)
      setOpponentWonCards(oppWon)

      // Actualizar mano quitando la carta jugada
      setHand(prev => prev.filter(c => c.id !== data.cards[user.id]?.id))
    })

    socket.on('hand:new', ({ hand: newHand }) => {
      setHand(prev => [...prev, ...newHand])
    })

    socket.on('game:over', (data) => {
      setGameOver(data)
      setStatus('over')
    })

    return () => {
      socket.off('opponent:played')
      socket.off('round:result')
      socket.off('hand:new')
      socket.off('game:over')
    }
  }, [token, user.id])

  const playCard = (cardId) => {
    if (status !== 'playing') return
    const socket = getSocket(token)
    socket.emit('card:play', { roomId: gameData.roomId, cardId })
    setStatus('waiting')
  }

  const handleLeave = () => {
    sessionStorage.removeItem('gameData')
    navigate('/lobby')
  }

  if (status === 'over') {
    const iWon = gameOver.winnerId === user.id
    return (
      <div style={{ maxWidth: 500, margin: '100px auto', textAlign: 'center' }}>
        <h2>{iWon ? '🏆 ¡Has ganado!' : '💀 Has perdido'}</h2>
        <p>{iWon ? `Ganaste contra ${gameData.opponent.username}` : `${gameOver.winnerUsername} ha ganado`}</p>
        <button onClick={handleLeave} style={{ padding: '10px 24px', marginTop: 16 }}>
          Volver al lobby
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span>Tú: {user.username}</span>
        <span>vs</span>
        <span>Rival: {gameData.opponent?.username}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <small>Tus cartas ganadas: {wonCards.length}</small>
        <small>Cartas rival: {opponentWonCards.length}</small>
      </div>

      {lastRound && (
        <div style={{ background: '#f0f0f0', padding: 12, marginBottom: 16, borderRadius: 8 }}>
          <strong>Última ronda:</strong>{' '}
          {lastRound.winnerId === user.id ? '✅ Ganaste' : lastRound.winnerId ? '❌ Perdiste' : '🤝 Empate'}
          {' — '}{lastRound.reason === 'element_advantage' ? 'ventaja elemental' : lastRound.reason === 'higher_power' ? 'mayor poder' : 'empate exacto'}
        </div>
      )}

      <h3>
        {status === 'playing' ? 'Elige una carta:' : 'Esperando al rival...'}
      </h3>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {hand.map(card => (
          <button
            key={card.id}
            onClick={() => playCard(card.id)}
            disabled={status !== 'playing'}
            style={{
              padding: 16,
              border: `2px solid ${card.element === 'fire' ? 'red' : card.element === 'water' ? 'blue' : 'lightblue'}`,
              borderRadius: 8,
              background: status === 'playing' ? 'white' : '#eee',
              cursor: status === 'playing' ? 'pointer' : 'not-allowed',
              minWidth: 80,
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{card.name}</div>
            <div style={{ fontSize: 12 }}>{card.element}</div>
            <div style={{ fontSize: 18 }}>⚡{card.power}</div>
            <div style={{ fontSize: 11, color: '#666' }}>{card.color}</div>
          </button>
        ))}
      </div>

      {wonCards.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <strong>Tus cartas ganadas:</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {wonCards.map((card, i) => (
              <span key={i} style={{ padding: '4px 8px', background: '#e0ffe0', borderRadius: 4, fontSize: 12 }}>
                {card.element} · {card.color}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}