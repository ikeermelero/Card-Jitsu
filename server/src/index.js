import express from 'express'
import dotenv from 'dotenv'
import router from './routes/router.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import {checkDB,syncDB} from './config/db.js'

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

app.use(express.json())
app.use(express.urlencoded()) 

app.use("/", router)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

checkDB();
syncDB();

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`)
})