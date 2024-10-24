import ConversationModal from "../models/ConversationModal.js"
import MessageModal from "../models/MessageModal.js"
import { UserModel } from "../models/Users.js"
import { getReceiverSocketId, io } from "../Socket/socket.js"

export const getMessages = async (req, res) => {
  const { senderId } = req.body
  const { id: receiverId } = req.params

  const conversation = await ConversationModal.findOne({
    participants: { $all: [senderId, receiverId] }
  }).populate('messages')

  // const LoggedUser = await UserModel.findById(senderId)
  // const UserFriend = await UserModel.findById(receiverId)

  if (!conversation) return res.status(404).json({ message: 'Unable to find the conversation' })

  const messages = conversation.messages

  return res.status(200).json({ messages: messages })
}

export const sendMessage = async (req, res) => {
  const { message, senderId } = req.body
  const { id: receiverId } = req.params

  let conversation = await ConversationModal.findOne({
    participants: { $all: [senderId, receiverId] }
  })
  // $all is a MongoDB operator that matches arrays that contain all elements specified in the array.

  if (!conversation) {
    conversation = await ConversationModal.create({
      participants: [senderId, receiverId]
    })
  }

  const LoggedUser = await UserModel.findById(senderId)

  const newMessage = new MessageModal({
    senderId,
    receiverId,
    message,
    author: LoggedUser.firstName,
  })

  if (newMessage) {
    conversation.messages.push(newMessage._id)
  }

  await Promise.all([conversation.save(), newMessage.save()])

  // This only works when other user is online, (like for checking OnlineUsers are online or the user we want to sendMessage is online)
  const ReceivedSocketId = getReceiverSocketId(receiverId)
  // console.log('ReceivedSocketId: ', ReceivedSocketId);

  if (ReceivedSocketId) {
    io.to(ReceivedSocketId).emit('newMessage', newMessage)
  }

  return res.status(200).json({ newMessage: newMessage })
}