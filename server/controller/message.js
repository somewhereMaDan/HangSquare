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

export const deleteMessage = async (req, res) => {
  const { id: MsgId } = req.params;
  const { senderId, receiverId } = req.body;

  // Check if message exists before attempting deletion
  const message = await MessageModal.findById(MsgId);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  // Delete the message
  await MessageModal.findByIdAndDelete(MsgId);

  // Update the conversation to remove the message ID from messages array
  const conversation = await ConversationModal.findOneAndUpdate(
    { participants: { $all: [senderId, receiverId] } },
    { $pull: { messages: MsgId } }, // note: `messages` field
    { new: true }
  ).populate('messages');

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  const ReceivedSocketId = getReceiverSocketId(receiverId)

  if (ReceivedSocketId) {
    // console.log("Emitting messages:", conversation.messages);  // Log emitted message
    io.to(ReceivedSocketId).emit('UpdatedMessages', conversation.messages);
  }

  res.status(200).json({
    message: 'Chat deleted successfully',
    UpdatedMsg: conversation.messages,
  });
};
