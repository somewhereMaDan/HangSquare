import { React, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import { io } from 'socket.io-client'
import OnlineIcon from '../assets/OnlineIcon.png'
import { TempContext } from '@/Contexts/TempContext'
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { useSocketContext } from '../Contexts/SocketContext'
import ChatWindowMsgOption from '@/components/ChatWindowMsgOption'
import { useMessage } from '@/Contexts/MessageContext'



export default function ChatWindow({ FriendId }) {
  const [MsgText, setMsgText] = useState('')
  // const [MessageList, setMessageList] = useState([])
  const { MessageList, setMessageList } = useMessage()
  const LoggedUserId = userGetId()
  const { OnlineUsers, socket } = useSocketContext()

  const SendMessage = async () => {
    if (MsgText.trim() === '') {
      toast.info('Please enter a message!')
      return
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ChatApp/send/${FriendId}`, {
        message: MsgText,
        senderId: LoggedUserId
      })
      setMessageList((prev) => [...prev, response.data.newMessage])
      setMsgText('')
    } catch (err) {
      console.log(err);
    }
  }

  const GetMessages = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ChatApp/${FriendId}`, {
        senderId: LoggedUserId
      })
      setMessageList(response.data.messages);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Handle the 404 error specifically
        console.log('No conversation found for this friend.');
        setMessageList([]); // Clear messages as there are none
      } else {
        console.log('Error fetching messages:', err);
      }
    }
  }
  // console.log(OnlineUsers);


  useEffect(() => {
    if (FriendId) {
      setMessageList([])
      GetMessages()
    }
    socket?.on('newMessage', (newMessage) => {
      if (newMessage.senderId === FriendId && newMessage.receiverId === LoggedUserId) {
        setMessageList((prev) => [...prev, newMessage])
      }
    })
    return () => {
      if (socket) {
        socket.off('newMessage')
      }
    }
  }, [FriendId])

  return (
    <div className='chat-window-inner-div'>
      <div className='chat-window'>
        <div className='firstHalf-chat-window'>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1%' }} className='chat-header'>
            {
              OnlineUsers?.includes(FriendId) && <img style={{ height: '2vh' }} src={OnlineIcon}></img>
            }
            <p>Live Chat</p>
          </div>
          <div className='chat-body' style={{ minHeight: '51vh' }}>
            {MessageList.length !== 0 ? MessageList?.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={LoggedUserId === messageContent.senderId ? "other" : "you"}
                  key={messageContent._id}
                >
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                      <div style={{ marginRight: '2%' }}>
                        {
                          LoggedUserId === messageContent.senderId && <ChatWindowMsgOption senderId={messageContent.senderId} receiverId={messageContent.receiverId} msgId={messageContent._id} />
                        }
                      </div>
                    </div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{new Date(messageContent.createdAt).toLocaleString()}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            }) : (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <div style={{ marginTop: '5vh' }}>
                No Conversation yet..
              </div>
            </div>)}
          </div>
        </div>
        <div className='SecondHalf-chat-window'>
          <div className='chat-footer'>
            <div className='Chat-TextArea'>
              {/* <Input onChange={(e) => setMsgText(e.target.value)} value={MsgText} type='text' placeholder='This is a message'></Input> */}
              <Textarea style={{ height: '1vh' }} onChange={(e) => setMsgText(e.target.value)} value={MsgText} placeholder="Send a message" />
            </div>
            {/* <button >Send</button> */}
            <button className='sendMsgBtn' style={{ marginLeft: '1%' }} onClick={SendMessage} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// export default ChatWindow