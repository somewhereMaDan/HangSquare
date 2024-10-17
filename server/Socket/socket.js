import { Server } from "socket.io";
import http, { METHODS } from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET']
  }
})

export const getReceiverSocketId = (receiverId) => {
  // as it just checking if the receiver is online (because it'll only get executed when userSocketMap variable is there which'll be there only when user is connected)
  return userSocketMap[receiverId]
}

const userSocketMap = {}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id
  }

  console.log(`User connected with UserId : ${userId} and socket id:  ${userSocketMap[userId]}`);

  io.emit('GetOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log(`User DISCONNECTED with UserId : ${userId} and socket id:  ${userSocketMap[userId]}`);
    delete userSocketMap[userId]
    io.emit('GetOnlineUsers', Object.keys(userSocketMap))
  })
})

export { app, io, server }