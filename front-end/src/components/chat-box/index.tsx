import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client'
// import { useUserContext } from '../../../context/UserContext'
import './styles.scss';
import { HandleChangeProps } from '../models/AuthModels';
import Card from '../../utils/reusable/Card';
import { Button } from '../../utils/reusable/styles/Design';
import { UserData } from '../../context/Models';
import { getRoomMessages } from '../../store/saga/Actions';
import { RootState } from '../../store/Store';
import { Message } from '../../store/sliceFiles/MessagesSlice';

interface ChatBoxProps {
  userData: UserData;
  state: RootState;
  socket: Socket
}
const ChatBox = ({ userData, state, socket }: ChatBoxProps) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { messages } = state;
  socket.off('new-message').on('new-message', (msz) => {
    console.log('MSZ::RECEIVED', msz)
    setTotalMessages(prev => ([...prev, msz]))
  })
  const [totalMessages, setTotalMessages] = useState<Message[]>(messages.messages)
  console.log('CHAT_BOX::', totalMessages)
  const handleChange = (e: HandleChangeProps) => {
    setMessage(e.target.value);
  };
  const messageRender = (msz: Message) => {
    const className = msz.from === userData.userName ? 'user-message' : 'opponent-message';
    return (
      <div className={className} key={msz._id}>
        <span className='author'>{msz.from}:</span> <span className='content'>{msz.content}</span>
      </div>
    );
  };
  const supportedFormats = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.openxmlformats-officedocument.wordprocessingml.document" ,"application/x-zip-compressed", "application/pdf", "image/jpeg", "image/png"]
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FILE::', e.target.files?.[0], state);
    if (e.target.files !== null) {
      const {name, size , type} = e.target.files[0]
      if (supportedFormats.find(val => val.includes(type))) {
        console.log('DATA::', name, size, type)
        if (size < 3000000) {
          console.log('OK ', supportedFormats)
          handleMessage(name, type)
        } else {
          console.log('More than 3 mb not allowed ')
        }
      } else {
        console.log('File Format not supported')
      }

    }
    // const file : File | null= e.target.files?.[0] || null
    // setTotalMessages((prev) => [...prev, file?.name || ''])
  };
  const handleMessage = (content = message, type= 'message') => {
    console.log('SENT::', content);
    if (!content) {
      return '';
    }
    const msz : Message = {
      content,
      from: userData.userName,
      to: userData.roomId,
      type,
    }
    setMessage('');
    setTotalMessages([...totalMessages, msz])
    socket.emit('add-message', msz)
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleMessage()
  }
  useEffect(() => {
    dispatch(getRoomMessages(userData.roomId));
  }, []);
  useEffect(()=> {
    setTotalMessages(messages.messages)
  }, [messages.messages])
  return (
    <div className="chat-box">
      <div className="chat-header">
        <span>&#8592;</span>
        <span> {userData.roomName || state.room.roomName}</span>
      </div>
      <div className="chat-body">
        <Card data={totalMessages} render={messageRender} />
      </div>
      <div className="chat-footer">
        <label className="file-label">
          <input type="file" onChange={handleFileUpload} />
          &#43;
        </label>
        <label>
          <input
            placeholder="type something..."
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </label>
        <Button text="Send" onClick={() => handleMessage()} />
      </div>
    </div>
  );
};

export default ChatBox;
