import React, { useContext, useState, createContext  } from 'react'
import { io, Socket } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { ContextState, UserContextProps, UserData } from './Models'
import { BE_URL } from '../store/api/MessagesApi'
import { addNotification } from '../store/sliceFiles/Notification'
import { Severity } from '../utils/Notification'

const ContextData = createContext<ContextState | null>(null)
const socket: Socket = io(BE_URL)
interface SocketError {
  error: string
  message: string
}

const UserContext = ({ children }: UserContextProps) => {
  const dispatch = useDispatch()
  const storedValue = localStorage.getItem('file-share-user')
  const prevUser : UserData = storedValue ? JSON.parse(storedValue) : {
    userName: '',
    roomName: '',
    roomId:'',
    userPassword:''
  }
  const [userData, setUserData] = useState<UserData>(prevUser)
  const [users,setUsers] = useState<UserData[]>([])
  const value: ContextState = { userData, setUserData, users, setUsers, socket }
  socket.on('errorEvent', (error: SocketError) => {
    dispatch(addNotification({
      content: error.message,
      severity: Severity.ERROR
    }))
  })
  return (
    <ContextData.Provider value={value}>
      {children}
    </ContextData.Provider>
  )
}
export const  useUserContext = () => useContext(ContextData)

export default UserContext