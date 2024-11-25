import { React, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import moreImg from '../assets/more.png'
import axios from 'axios';
import { toast } from 'sonner';
import { useMessage } from '@/Contexts/MessageContext';
import { useSocketContext } from '@/Contexts/SocketContext';

function ChatWindowMsgOption({ senderId, receiverId, msgId }) {
  const { MessageList, setMessageList } = useMessage()
  const { socket } = useSocketContext()
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Unique identifier for updates
  const ToRedirectProfile = () => {
    console.log('profile');
  }

  const ToDeleteMsg = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ChatApp/delete/${msgId}`, {
        senderId: senderId,
        receiverId: receiverId
      })
      toast.success(response.data.message)
      setMessageList(response.data.UpdatedMsg)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    socket.on('UpdatedMessages', (UpdatedMsg) => {
      console.log("UpdatedMsg: ", UpdatedMsg);
      setMessageList(UpdatedMsg);
    });

    return () => {
      socket.off('UpdatedMessages'); // Clean up the listener
    };
  }, [MessageList]); // Add socket as a dependency

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <img style={{ height: '1.5vh' }} src={moreImg} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onSelect={ToRedirectProfile}>
            Profile
          </DropdownMenuItem> */}
          <DropdownMenuItem onSelect={ToDeleteMsg}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}

export default ChatWindowMsgOption