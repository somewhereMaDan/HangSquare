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
  return userSocketMap[receiverId]
}

const userSocketMap = {}

io.on('connection', (socket) => {
  // console.log('a user connected: ', socket.id);

  // const userId = '66fd8ba6538b7c44a517123a' // random for now
  // const userId = '66fc2aa9ce6f3964ababe5a3'
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id
  }

  console.log(`User connected with UserId : ${userId} and socket id:  ${userSocketMap[userId]}`);

  io.emit('GetOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    // console.log('user disconnected: ', socket.id);
    console.log(`User DISCONNECTED with UserId : ${userId} and socket id:  ${userSocketMap[userId]}`);
    delete userSocketMap[userId]
    io.emit('GetOnlineUsers', Object.keys(userSocketMap))
  })

  // socket.on('GetOnlineUser', (data) => {
  //   console.log("Total online users: ", data);
  // })
})

export { app, io, server }