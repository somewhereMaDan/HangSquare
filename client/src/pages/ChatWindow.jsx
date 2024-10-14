import { React, useState, useEffect } from 'react'
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'

function ChatWindow({ FriendId }) {
  const [MsgText, setMsgText] = useState('')
  const [MessageList, setMessageList] = useState([])
  // const FriendId = '6700c8232072a75dc7563cd1' //alice
  const LoggedUserId = userGetId()


  const SendMessage = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ChatApp/send/${FriendId}`, {
        message: MsgText,
        senderId: LoggedUserId
      })
      // setMessageList((prevMsgContent) => [...prevMsgContent, response.data.newMessage])
      setMessageList((prev) => [...prev, response.data.newMessage])
      console.log("By Sending Message: ", response.data);
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

      // console.log("From GetMessages: ", response.data);
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
  console.log(MessageList);

  useEffect(() => {
    if (FriendId) {
      setMessageList([])
      GetMessages()
    }
  }, [FriendId])
  return (
    <div>
      <div className='chat-window'>
        <div className='chat-header'>
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