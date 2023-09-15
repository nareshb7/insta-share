import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmpList from '../components/chat-box/EmpList';
import ChatBox from '../components/chat-box';
import './styles.scss';
import { useUserContext } from '../context/UserContext';
import { RootState } from '../store/Store';
import { joinRoomAction } from '../store/saga/Actions';
import { Link } from 'react-router-dom';

const MessagesPage = () => {
  const userContext = useUserContext();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    if (
      !state.room.roomId &&
      userContext !== null &&
      userContext.userData.roomId
    ) {
      dispatch(
        joinRoomAction({
          ...userContext.userData,
          isProtected: userContext.userData.isProtected || false,
        })
      );
      userContext.socket.emit('JOIN_ROOM', userContext.userData.roomId)
    }
  }, []);
  useEffect(() => {
    if (state.room.error) {
      setErrorMessage(state.room.error);
    }
  }, [state.room.error]);
  if (userContext === null) {
    // Handle the case where the context is null
    return <div>Loading...</div>; // or some other fallback
  }
  const { userData, socket } = userContext;
  return (
    <>
      {' '}
      {state.room.isSuccess ? (
        <div className="chat-main">
          <EmpList userData={userData} roomData={state.room} />
          <ChatBox userData={userData} state={state} socket={socket} />
        </div>
      ) : (
        <div className='chat-error-page'>
          <span className="error-message">{errorMessage}</span>
          <div><Link to='/'>Click here</Link> to go to Home page</div>
        </div>
      )}
    </>
  );
};

export default MessagesPage;
