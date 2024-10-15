import { Button } from '@/components/ui/button'
import { TempContext } from '@/Contexts/TempContext'
import { userGetId } from '@/hooks/userGetId'
import axios from 'axios'
import { React, useContext, useEffect, useState } from 'react'
import './ChatSection.css'
import { Separator } from "@/components/ui/separator"
import ChatWindow from './ChatWindow'

function ChatSection() {
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
      <div className='friend-list'>
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
                  <div>
                    {/* {
                      LoggedUserId === UserId && <button onClick={() => RemoveFriend(friend._id)}>
                        <img style={{ height: "2.5vh", borderRadius: "5px" }} src={RemoveFriendPic}></img>
                      </button>
                    } */}
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
      {
        FriendId && <ChatWindow FriendId={FriendId}></ChatWindow>
      }
    </div>
  )
}

export default ChatSection