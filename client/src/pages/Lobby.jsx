import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getSocket } from '../socket/socket.js'

export default function Lobby() {
  const { user, token, logout } = useAuth()
  const [status, setStatus] = useState('idle') // idle | waiting | found
  const navigate = useNavigate()

  useEffect(() => {
    const socket = getSocket(token)
    socket.connect()

    socket.on('queue:waiting', () => setStatus('waiting'))

    socket.on('game:start', (data) => {
      console.log('GAME START DATA:', data)
      sessionStorage.setItem('gameData', JSON.stringify(data))
      console.log('SESSION:', sessionStorage.getItem('gameData'))
      navigate('/game')
    })

    socket.on('error', (data) => {
      console.error(data.message)
      setStatus('idle')
    })

    return () => {
      socket.off('queue:waiting')
      socket.off('game:start')
      socket.off('error')
    }
  }, [token, navigate])

  const handleSearch = () => {
    const socket = getSocket(token)
    socket.emit('queue:join')
    setStatus('waiting')
  }

  const handleCancel = () => {
    const socket = getSocket(token)
    socket.emit('queue:leave')
    setStatus('idle')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 500, margin: '100px auto', padding: 24, textAlign: 'center' }}>
      <h2>Bienvenido, {user.username}</h2>
      <p>ELO: {user.elo} </p>

      {status === 'idle' && (
        <button onClick={handleSearch} style={{ padding: '12px 32px', fontSize: 16 }}>
          Buscar partida
        </button>
      )}

      {status === 'waiting' && (
        <div>
          <p>Buscando oponente...</p>
          <button onClick={handleCancel} style={{ padding: '8px 24px' }}>
            Cancelar
          </button>
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}