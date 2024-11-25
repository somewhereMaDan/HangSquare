import { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [MessageList, setMessageList] = useState([]);
  return (
    <MessageContext.Provider value={{ MessageList, setMessageList }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
