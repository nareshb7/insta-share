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
import { Message, MessageSlice } from '../../store/sliceFiles/MessagesSlice';
import { fileDownload, fileUpload } from '../../store/api/FileUploadApi';
import { addNotification } from '../../store/sliceFiles/Notification';
import { Severity } from '../../utils/Notification';
import { RoomSliceState } from '../../store/sliceFiles/RoomSlice';
// import { deleteMessage } from '../../store/api/MessagesApi';

interface ChatBoxProps {
  userData: UserData;
  room: RoomSliceState;
  messages: MessageSlice;
  socket: Socket;
}
interface LiveChatProps {
  [key: string]: string;
}
const downloadFile = async (
  e: React.MouseEvent,
  url: string = '',
  fileName: string
) => {
  e.stopPropagation();
  const el = document.createElement('a');
  el.href = url;
  el.target = '_blank';
  el.download = fileName;
  el.click();
  return url;
};
const getMessageType = (data: string): string => {
  if (data.includes('pdf')) return 'application/pdf';
  else if (data.includes('jpeg')) return 'image/jpeg';
  else if (data.includes('sheet')) return 'xlsx';
  return data;
};
interface FileComponentProps {
  file: Message;
  className: string;
}
const FileRenderer = ({ type, fileUrl }: { type: string; fileUrl: string }) => {
  switch (type) {
    case 'application/pdf': {
      return <iframe src={fileUrl} width="100%" title="PDF Viewer"></iframe>;
    }
    case 'image/jpeg': {
      return <img src={fileUrl} width="100%" alt={type} />;
    }
    case 'video': {
      return (
        <video controls width="400">
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    default:
      return <div>{type}</div>;
  }
};
const FileComponent = ({ file, className = '' }: FileComponentProps) => {
  const [fileUrl, setFileUrl] = useState('');
  useEffect(() => {
    const getFileFromDb = async (id: string = '') => {
      const file = await fileDownload(id);
      const base64 = new Uint8Array(file.data.data);
      const url = URL.createObjectURL(new Blob([base64], { type: file.type }));
      setFileUrl(url);
      return url;
    };
    getFileFromDb(file.fileId);
  }, []);
  return (
    <div
      style={{ width: '200px', border: '1px solid #ddd' }}
      className={className}
      onClick={(e) => downloadFile(e, fileUrl, file.content)}
    >
      <span className="author">{file.from}:</span>{' '}
      <div>
        {fileUrl && (
          <FileRenderer type={getMessageType(file.type)} fileUrl={fileUrl} />
        )}
      </div>
      <span className="content">{file.content}</span>
      <span className="time-indicator">
        {' '}
        {file?.createdAt && new Date(file.createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
};
const ChatBox = ({ userData, messages, room, socket }: ChatBoxProps) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const [totalMessages, setTotalMessages] = useState<Message[]>(
    messages.messages
  );
  const [livechatcontent, setLiveChatContent] = useState<LiveChatProps>({});
  const lastMszRef = useRef<HTMLDivElement | null>(null);
  socket.off('NEW_MESSAGE').on('NEW_MESSAGE', (msz) => {
    setTotalMessages((prev) => [...prev, msz]);
  });
  socket.off('MESSAGE_DELETED').on('MESSAGE_DELETED', (file) => {
    const messages = totalMessages.filter((msz) => msz._id != file._id);
    setTotalMessages(messages);
    dispatch(
      addNotification({
        content: 'Message deleted',
        severity: Severity.SUCCESS,
      })
    );
  });
  socket.off('liveMessages').on('liveMessages', (data)=> {
    setLiveChatContent(data)
  })
  const handleLiveChat = (content: string)=> {
    if (room.liveChatEnabled) {
      setLiveChatContent({
        ...livechatcontent,
        [userData.userName?.split(';')[0]]: content,
      });
      socket.emit('liveChat',room.roomId, userData.userName?.split(';')[0], content )
    }
  }
  const handleChange = (e: HandleChangeProps) => {
    const letters = e.target.value.split(' ')
    const isValidMsz = letters.find(letter => letter.length > 20)
    if (!isValidMsz && e.target.value.length < 100) {
      setMessage(e.target.value);
      handleLiveChat(e.target.value)
    } else {
      const content = e.target.value.length < 100 ? "I want space": "More than 100 characters not allowed"
      dispatch(
        addNotification({
          content,
          severity: Severity.ERROR,
        })
      );
    }
  };
  const handleDeleteMessage = async (msz: Message) => {
    if (
      userData.userName === msz.from ||
      userData.userName === room.ownerName
    ) {
      const cnfrm = window.confirm('Do u want to delete this msz??');
      if (cnfrm) {
        socket.emit('DELETE_MESSAGE', msz._id);
      }
    } else {
      dispatch(
        addNotification({
          content: "U can't delete other's message...",
          severity: Severity.ERROR,
        })
      );
    }
  };
  const messageRender = (msz: Message) => {
    const className =
      msz.from === userData.userName ? 'user-message' : 'opponent-message';

    if (msz.type === 'message') {
      return (
        <div
          ref={lastMszRef}
          className={className}
          key={msz._id}
          onDoubleClick={() => handleDeleteMessage(msz)}
        >
          <span className="author">{msz.from}:</span>{' '}
          <span className="content">{msz.content}</span>
          <span className="time-indicator">
            {' '}
            {msz?.createdAt && new Date(msz.createdAt).toLocaleTimeString()}
          </span>
        </div>
      );
    } else {
      return (
        <div ref={lastMszRef} onDoubleClick={() => handleDeleteMessage(msz)}>
          <FileComponent file={msz} className={className} />
        </div>
      );
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
      from: userData.userName.split(';')[0],
      to: userData.roomId,
      type,
      fileId,
    };
    setMessage('');
    setLiveChatContent({
      ...livechatcontent,
      [userData.userName?.split(';')[0]]: '',
    });
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
        <span> {userData.roomName || room.roomName}</span>
      </div>
      <div className="chat-body">
        <Card data={totalMessages} render={messageRender} />
      </div>
      <div>
        {room.liveChatEnabled &&
          Object.keys(livechatcontent).filter(val => livechatcontent[val].length > 0).map((user, idx) => (
            <div key={idx}>
              {user}: {livechatcontent[user]}
            </div>
          ))}
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
