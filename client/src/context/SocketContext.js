import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "../hooks/useSocket";

const SocketContext = createContext(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();

  const socketData = useSocket(token, user?._id);

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};
