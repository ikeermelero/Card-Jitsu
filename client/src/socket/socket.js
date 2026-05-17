import { io } from 'socket.io-client'

let socket = null

export function getSocket(token) {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      autoConnect: false,
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}