import React, { useContext, useState } from 'react'
import { createContext } from 'react'
import { ContextState, UserContextProps, UserData } from './Models'

const ContextData = createContext<ContextState | null>(null)

const UserContext = ({ children }: UserContextProps) => {
  const [userData, setUserData] = useState<UserData>({
    userName: '',
    roomName: '',
    roomId:''
  })
  const [users,setUsers] = useState<UserData[]>([])
  const value: ContextState = { userData, setUserData, users, setUsers }
  return (
    <ContextData.Provider value={value}>
      {children}
    </ContextData.Provider>
  )
}
export const  useUserContext = () => useContext(ContextData)

export default UserContext