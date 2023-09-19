import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';
// import { useUserContext } from '../../../context/UserContext'
import './styles.scss';
import { HandleChangeProps } from '../models/AuthModels';
import Card from '../../utils/reusable/card/Card';
import { Button } from '../../utils/reusable/styles/Design';
import { UserData } from '../../context/Models';
import { getRoomMessages } from '../../store/saga/Actions';
import { RootState } from '../../store/Store';
import { Message } from '../../store/sliceFiles/MessagesSlice';
import { fileDownload, fileUpload } from '../../store/api/FileUploadApi';
import { addNotification } from '../../store/sliceFiles/Notification';
import { Severity } from '../../utils/Notification';
// import { deleteMessage } from '../../store/api/MessagesApi';

interface ChatBoxProps {
  userData: UserData;
  state: RootState;
  socket: Socket;
}
const getFileFromDb = async (id: string = '') => {
  const file = await fileDownload(id);
  const base64 = new Uint8Array(file.data.data);
  const url = URL.createObjectURL(new Blob([base64], { type: file.type }));
  const el = document.createElement('a');
  el.href = url;
  el.download = file.fileName;
  el.click();
  return url;
};
const getMessageType = (data: string): string => {
  if (data.includes('pdf')) return 'application/pdf';
  else if (data.includes('jpeg')) return 'image/jpeg';
  return '';
};
const renderFile = (msz: Message, className = '') => {
  switch (getMessageType(msz.type)) {
    case 'application/pdf':
    case 'image/png':
    case 'image/jpeg': {
      return (
        <div className={className} key={msz._id}>
          <span className="author">{msz.from}:</span>{' '}
          <span className="content">{msz.content}</span>
          <span
            className="download-icon"
            onClick={() => getFileFromDb(msz.fileId)}
          >
            {' '}
            &#8595;{' '}
          </span>
        </div>
      );
    }
    default:
      return (
        <div>
          <span className="author">{msz.from}:</span>{' '}
          <span className="content">{msz.content}</span>
        </div>
      );
  }
};
const ChatBox = ({ userData, state, socket }: ChatBoxProps) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { messages } = state;
  const [totalMessages, setTotalMessages] = useState<Message[]>(
    messages.messages
  );
  const lastMszRef = useRef<HTMLDivElement | null>(null);
  socket.off('NEW_MESSAGE').on('NEW_MESSAGE', (msz) => {
    setTotalMessages((prev) => [...prev, msz]);
  });
  socket.off('MESSAGE_DELETED').on('MESSAGE_DELETED', (file) => {
    // setTotalMessages((prev) => [...prev, msz]);
    const messages = totalMessages.filter(msz => msz._id != file._id)
    console.log('MESSAGE:"DELETED::',{file, messages, totalMessages} )
    setTotalMessages(messages)
  });
  const handleChange = (e: HandleChangeProps) => {
    setMessage(e.target.value);
  };
  const handleDeleteMessage = async(msz: Message)=> {
    const cnfrm = window.confirm('Do u want to delete this msz??')
    if (cnfrm) {
      // const res = await deleteMessage(msz._id)
      // if (res.error) {
      //   dispatch(addNotification({
      //     content: 'Deleting Error',
      //     severity: Severity.ERROR
      //   }))
      // } 
      socket.emit('DELETE_MESSAGE', msz._id)
      console.log('Deleted Sucess')
      
    }
  }
  const messageRender = (msz: Message) => {
    const className =
      msz.from === userData.userName ? 'user-message' : 'opponent-message';

    if (msz.type === 'message') {
      return (
        <div ref={lastMszRef} className={className} key={msz._id} onDoubleClick={()=> handleDeleteMessage(msz)}>
          <span className="author">{msz.from}:</span>{' '}
          <span className="content">{msz.content}</span>
          <span className="time-indicator">
            {' '}
            {msz?.createdAt && new Date(msz.createdAt).toLocaleTimeString()}
          </span>
        </div>
      );
    } else {
      return <div ref={lastMszRef} onDoubleClick={()=> handleDeleteMessage(msz)}>{renderFile(msz, className)}</div>;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await fileUpload(formData);
      if (res.error) {
        dispatch(
          addNotification({ content: res.error, severity: Severity.ERROR })
        );
        return '';
      }
      handleMessage(res.fileName, res.type, res._id);
    }
  };
  const handleMessage = (content = message, type = 'message', fileId = '') => {
    if (!content) {
      return '';
    }
    const msz: Message = {
      content,
      from: userData.userName,
      to: userData.roomId,
      type,
      fileId,
    };
    setMessage('');
    socket.emit('ADD_MESSAGE', msz);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleMessage();
  };
  const scrollToBottom = () => {
    lastMszRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };
  useEffect(() => {
    dispatch(getRoomMessages(userData.roomId));
  }, []);
  useEffect(() => {
    setTotalMessages(messages.messages);
  }, [messages.messages]);
  useEffect(() => {
    scrollToBottom();
  }, [totalMessages]);
  return (
    <div className="chat-box">
      <div className="chat-header">
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
