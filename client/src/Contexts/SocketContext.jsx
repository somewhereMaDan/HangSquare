import { userGetId } from "@/hooks/userGetId";
import { useState, useEffect, useContext, createContext } from "react";
import io from 'socket.io-client'

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = () => {
  const LoggedUserId = userGetId()
  const [socket, setSocket] = useState('')
  const [OnlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (LoggedUserId) {
      const socket = io(`${import.meta.env.VITE_API_URL}`, {
        query: {
          LoggedUserId: LoggedUserId
        }
      })
      setSocket(socket)
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
  }, [LoggedUserId])
  return <SocketContext.Provider value={{ socket, OnlineUsers }}></SocketContext.Provider>
}