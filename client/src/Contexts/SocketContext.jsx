import App from "@/App";
import { userGetId } from "@/hooks/userGetId";
import { useState, useEffect, useContext, createContext } from "react";
import io from 'socket.io-client'

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};


export const SocketContextProvider = ({ children }) => {
  const LoggedUserId = userGetId()
  const [socket, setSocket] = useState(null)
  const [OnlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (LoggedUserId) {
      const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
        query: {
          userId: LoggedUserId
        }
      })
      setSocket(newSocket)
      newSocket.on('GetOnlineUsers', (users) => {
        setOnlineUsers(users)
      })
      return () => {
        newSocket.close()
      }
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [LoggedUserId])

  return <SocketContext.Provider value={{ socket, OnlineUsers }}>
    {children}
  </SocketContext.Provider>
}