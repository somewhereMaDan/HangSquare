import { Button } from '@/components/ui/button'
import { TempContext } from '@/Contexts/TempContext'
import { userGetId } from '@/hooks/userGetId'
import axios from 'axios'
import { React, useContext, useEffect, useState } from 'react'
import './ChatSection.css'
import { Separator } from "@/components/ui/separator"
import ChatWindow from './ChatWindow'

function ChatSection({ socket }) {
  const { UserFriends, UserFriendsId } = useContext(TempContext)
  // const FriendId = '6700c8232072a75dc7563cd1' //alice
  const [FriendId, setFriendId] = useState('')
  const GetFriendId = (FriendId) => {
    setFriendId(FriendId)
  }


  return (
    <div className='ChatSection'>
      {/* <h1>ChatSection</h1>
      <input onChange={(e) => setMsgText(e.target.value)} type='text' placeholder='Type a message' />
      <Button onClick={SendMessage}>Send Message</Button> */}
      <div className='friend-list-chat-section-inside'>
        <div className='friend-list-chat-section'>
          <h3>Friend List</h3>
          <Separator className="my-4" />
          {
            UserFriends?.map((friend) => {
              if (UserFriendsId.includes(friend._id)) {
                return (
                  <div key={friend._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '4%' }}>
                    <div>
                      <div>{friend.firstName} {friend.lastName}</div>
                      <p className="text-sm text-muted-foreground">
                        {friend.Bio}
                      </p>
                    </div>
                    <div style={{ marginLeft: '2%' }}>
                      {
                        <Button onClick={() => GetFriendId(friend._id)}>Chat</Button>
                      }
                    </div>
                  </div>
                )
              }
            })
          }
        </div>
      </div>
      <div className='chat-window-div'>
        {
          FriendId ? <ChatWindow FriendId={FriendId}></ChatWindow> :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <div>Select a <b>Friend</b> from <b>Friend-List</b> to Chat with...</div>
            </div>
        }
      </div>
    </div>
  )
}

export default ChatSection