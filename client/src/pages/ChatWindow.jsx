import { React, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import { io } from 'socket.io-client'
import OnlineIcon from '../assets/OnlineIcon.png'
import { TempContext } from '@/Contexts/TempContext'

function ChatWindow({ FriendId }) {
  const [MsgText, setMsgText] = useState('')
  const [MessageList, setMessageList] = useState([])
  // const FriendId = '6700c8232072a75dc7563cd1' //alice
  const LoggedUserId = userGetId()
  // const [socket, setSocket] = useState('')
  const [OnlineUsers, setOnlineUsers] = useState([])

  const SendMessage = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ChatApp/send/${FriendId}`, {
        message: MsgText,
        senderId: LoggedUserId
      })
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
  // console.log(UserFriends);
  // console.log(MessageList);
  console.log(OnlineUsers);


  useEffect(() => {
    if (FriendId) {
      setMessageList([])
      GetMessages()
    }
    if (LoggedUserId) {
      const socket = io(`${import.meta.env.VITE_API_URL}`, {
        transports: ['websocket'], // Ensure websocket transport is enabled
        query: {
          userId: LoggedUserId
        }
      })
      if (socket) {
        socket.on('newMessage', (newMessage) => {
          if (newMessage.senderId === FriendId && newMessage.receiverId === LoggedUserId) {
            setMessageList((prev) => [...prev, newMessage])
          }
        })
      }
      socket.on('GetOnlineUsers', (users) => {
        setOnlineUsers(users)
      })
      return () => {
        socket.close()
      }
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }

    // Clean up the listener when the component unmounts or FriendId changes
    return () => {
      if (socket) {
        socket.off('newMessage')
      }
      setOnlineUsers(null)
    }
  }, [FriendId])

  return (
    <div>
      <div className='chat-window'>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='chat-header'>
          {
            OnlineUsers?.includes(FriendId) && <img style={{ height: '2vh' }} src={OnlineIcon}></img>
          }
          <p>Live Chat</p>
        </div>
        <div className='chat-body'>
          {MessageList.length !== 0 ? MessageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={LoggedUserId === messageContent.senderId ? "other" : "you"}
                key={messageContent._id}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.createdAt}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          }) : (<div>No Conversation yet..</div>)}
        </div>
        <div className='chat-footer'>
          <input onChange={(e) => setMsgText(e.target.value)} value={MsgText} type='text' placeholder='This is a message'></input>
          <button onClick={SendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow