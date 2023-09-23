import { ReactNode } from "react";
import { Socket } from 'socket.io-client'

export interface UserData {
    userName: string
    roomName: string
    roomId: string
    isProtected?: boolean
    password?: string
    userPassword?: string 
  }
export interface ContextState {
    userData: UserData
    setUserData: React.Dispatch<React.SetStateAction<UserData>>
    users: UserData[]
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>
    socket: Socket
  }
  
  export interface UserContextProps {
    children: ReactNode;
  }