import { Button } from '@/components/ui/button'
import { TempContext } from '@/Contexts/TempContext'
import { userGetId } from '@/hooks/userGetId'
import axios from 'axios'
import { React, useContext, useEffect, useState } from 'react'
import './ChatSection.css'
import { Separator } from "@/components/ui/separator"
import ChatWindow from './ChatWindow'
import ChatIcon from '../assets/comment.png'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useSocketContext } from '@/Contexts/SocketContext'
import OnlineIcon from '../assets/OnlineIcon.png'
import { MessageProvider } from '../Contexts/MessageContext'

function ChatSection({ socket }) {
  const { UserFriends, UserFriendsId } = useContext(TempContext)
  const { OnlineUsers } = useSocketContext()
  const [FriendId, setFriendId] = useState('')
  const GetFriendId = (FriendId) => {
    setFriendId(FriendId)
  }


  return (
    <div>
      {
        UserFriendsId.length !== 0 ? (
          <div className='ChatSection'>
            <div className='friend-list-chat-section-inside'>
              <div className='friend-list-chat-section'>
                <h3>Friend List</h3>
                <Separator className="my-4" />
                {
                  UserFriends?.map((friend) => {
                    if (UserFriendsId.includes(friend._id)) {
                      return (
                        <div key={friend._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '4%' }}>
                          <div className='avatar'>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <Avatar>
                                <AvatarImage style={{ objectFit: 'cover' }} src={friend.PicturePath} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                                {
                                  OnlineUsers?.includes(friend._id) && <img style={{ width: '14px', height: '14px' }} src={OnlineIcon}></img>
                                }
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>{friend.firstName} {friend.lastName}</div>
                            <p className="text-muted-foreground text-sm">
                              {friend.Bio}
                            </p>
                          </div>
                          <div>
                            {
                              <button onClick={() => GetFriendId(friend._id)}>
                                <img style={{ height: '3vh' }} src={ChatIcon}></img>
                              </button>
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
                FriendId ?
                  <MessageProvider>
                    <ChatWindow FriendId={FriendId}></ChatWindow>
                  </MessageProvider> :
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div>Select a <b>Friend</b> from <b>Friend-List</b> to Chat with...</div>
                  </div>
              }
            </div>
          </div>
        ) : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '10vh' }}>
          <div>
            You have no Friends to Start a Conversation with!
          </div>
          <div>
            Please Add someone in your Friend List to have a Conversation...
          </div>
        </div>
      }
    </div>
  )
}

export default ChatSection