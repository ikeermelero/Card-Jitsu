import express from 'express'
import dotenv from 'dotenv'
import router from './routes/router.js'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import {checkDB,syncDB} from './config/db.js'
import { socketAuthMiddleware } from './middlewares/socket.middleware.js'
import { registerMatchmakingHandlers } from './socket/matchmaking.js'
import { registerGameHandlers } from './socket/game.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const server = createServer(app)
const io = new Server(server, {
    cors:{
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded()) 

app.use("/", router)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

io.use(socketAuthMiddleware)

io.on('connection', (socket) => {
  console.log(`✓ Conectado: ${socket.user.username}`)
  registerMatchmakingHandlers(io, socket)
  registerGameHandlers(io, socket)

  socket.on('disconnect', () => {
    console.log(`✗ Desconectado: ${socket.user.username}`)
  })
})

checkDB();
//syncDB();

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`)
})