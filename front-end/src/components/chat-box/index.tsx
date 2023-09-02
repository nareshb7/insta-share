import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
// import { useUserContext } from '../../../context/UserContext'
import './styles.scss'
import { HandleChangeProps } from '../models/AuthModels'
import Card from '../../utils/reusable/Card'
import { Button } from '../../utils/reusable/styles/Design'
import { UserData } from '../../context/Models'
import { getRoomMessages, sendNewMessage } from '../../store/saga/Actions'
import { RootState } from '../../store/Store'


const messages: string[] = ['Hii', 'hello', 'how are you', 'i m good', 'wt abt uh', 'good', 'wr r u ','Hii', 'hello', 'how are you', 'i m good', 'wt abt uh', 'good', 'wr r u ','Hii', 'hello', 'how are you', 'i m good', 'wt abt uh', 'good', 'wr r u ', 'ofc', 'ok']
interface ChatBoxProps {
  userData: UserData
}
const ChatBox = ({userData}: ChatBoxProps) => {
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const messageState = useSelector((state: RootState) => state.messages.messages);

  const [totalMessages, setTotalMessages] = useState<string[]>(messages)
  console.log('CHAT_BOX::', messageState, totalMessages)
  const handleChange = (e: HandleChangeProps)=> {
    setMessage(e.target.value)
  }
  const messageRender = (msz: string, index: number = 0)=> {
    const className = index %2 == 0 ? 'user-message': 'opponent-message'
    return <div className={className} key={index}>{msz}</div> 
  }
  const handleFileUpload =(e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FILE::', e.target.files)
    const file : File | null= e.target.files?.[0] || null
    setTotalMessages((prev) => [...prev, file?.name || ''])
  }
  const handleMessage = ()=> {
    console.log('SENT::', message)
    setTotalMessages((prev) => [...prev, message])
    setMessage('')
    dispatch(sendNewMessage(message))
  }
  useEffect(()=> {
    dispatch(getRoomMessages())
  }, [])

  return (
    <div className='chat-box'>
      <div className='chat-header'>
        <span>&#8592;</span>
        <span> {userData.roomId}</span>
      </div>
      <div className='chat-body'>
      {
        messages.map((msz, idx)=> {
          const className = idx %2 == 0 ? 'user-message': 'opponent-message'
          return (<div className={className} key={idx}>{msz}</div>) 
        })
      }
      <Card data={messageState} render={messageRender} />
      </div>
      <div className='chat-footer'>
        <label className='file-label'>
          <input type='file' onChange={handleFileUpload} />
        &#43;
        </label>
        <label>
          <input placeholder='type something...' value={message} onChange={handleChange}/>
        </label>
        <Button text='Send' onClick={handleMessage} />
      </div>
    </div>
  )
}

export default ChatBox