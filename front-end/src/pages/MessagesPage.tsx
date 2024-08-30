import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmpList from '../components/chat-box/EmpList';
import ChatBox from '../components/chat-box';
import './styles.scss';
import { useUserContext } from '../context/UserContext';
import { RootState } from '../store/Store';
import { joinRoomAction } from '../store/saga/Actions';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/Models';

const MessagesPage = () => {
  const { userData, socket, setUserData } = useUserContext();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const messages = useSelector((state: RootState) => state.messages);
  const room = useSelector((state: RootState) => state.room);
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    if (!room.roomId && userData.roomId) {
      dispatch(
        joinRoomAction({
          ...userData,
          isProtected: userData.isProtected || false,
        })
      );
    }
    socket.emit('JOIN_ROOM', userData.roomId);
  }, []);
  useEffect(() => {
    console.log("room:::", room)
    if (room.error) {
      setErrorMessage(room.error);
      setUserData({} as UserData);
      navigate('/')
    }
  }, [room.error]);
  return (
    <>
      {' '}
      {room.isSuccess ? (
        <div className="chat-main">
          <EmpList userData={userData} roomData={room} socket={socket} />
          <ChatBox
            userData={userData}
            messages={messages}
            room={room}
            socket={socket}
          />
        </div>
      ) : (
        <div className="chat-error-page">
          <span className="error-message">{errorMessage}</span>
          <div>
            <Link to="/">Click here</Link> to go to Home page
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesPage;
