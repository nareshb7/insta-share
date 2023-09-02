import { ReactNode } from "react";

export interface UserData {
    userName: string
    roomName: string
    roomId: string
  }
export interface ContextState {
    userData: UserData
    setUserData: React.Dispatch<React.SetStateAction<UserData>>
    users: UserData[]
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>
  }
  
  export interface UserContextProps {
    children: ReactNode;
  }