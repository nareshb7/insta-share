import React from 'react'
import EmpList from '../components/chat-box/EmpList'
import ChatBox from '../components/chat-box'
import './styles.scss'
import { useUserContext } from '../context/UserContext'

const MessagesPage = () => {
  const userContext = useUserContext()
  if (userContext === null) {
    // Handle the case where the context is null
    return <div>Loading...</div>; // or some other fallback
  }
  const { userData} = userContext
  return (
    <div className='chat-main' >
        <EmpList userData={userData}/>
        <ChatBox userData={userData}/>
    </div>
  )
}

export default MessagesPage