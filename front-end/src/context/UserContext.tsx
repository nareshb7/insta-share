import React, { useContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { createContext } from 'react'
import { ContextState, UserContextProps, UserData } from './Models'
import { BE_URL } from '../store/api/MessagesApi'

const ContextData = createContext<ContextState | null>(null)
const socket: Socket = io(BE_URL)

const UserContext = ({ children }: UserContextProps) => {
  const storedValue = localStorage.getItem('file-share-user')
  const prevUser : UserData = storedValue ? JSON.parse(storedValue) : {
    userName: '',
    roomName: '',
    roomId:''
  }
  const [userData, setUserData] = useState<UserData>(prevUser)
  const [users,setUsers] = useState<UserData[]>([])
  const value: ContextState = { userData, setUserData, users, setUsers, socket }
  return (
    <ContextData.Provider value={value}>
      {children}
    </ContextData.Provider>
  )
}
export const  useUserContext = () => useContext(ContextData)

export default UserContext