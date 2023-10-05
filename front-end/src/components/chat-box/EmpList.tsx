import React, { useState } from 'react';
import Card from '../../utils/reusable/card/Card';
import { UserData } from '../../context/Models';
import { RoomSliceState, joinRoom } from '../../store/sliceFiles/RoomSlice';
import { Button } from '../../utils/reusable/styles/Design';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';

interface EmpListProps {
  userData: UserData;
  roomData: RoomSliceState;
  socket: Socket;
}

const EmpList = ({ userData, roomData, socket }: EmpListProps) => {
  const [showInfo, setShowInfo] = useState(true);
  const dispatch = useDispatch();
  socket.off('liveChatStatusUpdate').on('liveChatStatusUpdate', (res) => {
    dispatch(joinRoom(res));
  })
  const handleLiveChat = async () => {
    socket.emit('liveChatHandler',roomData.roomId, roomData.liveChatEnabled );
  };
  return (
    <div className="emp-list">
      <h2 className="room-user">
        User:{' '}
        <span style={{ color: '#888' }}>{userData.userName.split(';')[0]}</span>
      </h2>
      <hr />
      <h1 style={{ color: '#444' }}>Room Data: </h1>
      <hr />
      <div className="info-buttons">
        <Button text={'Members'} onClick={() => setShowInfo(false)} />
        <Button text={'Info'} onClick={() => setShowInfo(true)} />
      </div>
      <hr />
      {showInfo ? (
        <div className="room-info">
          <h4>RoomName : {roomData.roomName}</h4>
          <h4>RoomId : {roomData.roomId}</h4>
          <h4>Room Members: {roomData.users.length}</h4>
          <h4>Room Owner: {roomData.ownerName}</h4>
          <h4>Created On: {new Date(roomData.createdAt).toLocaleString()}</h4>
          {roomData.ownerName === userData.userName.split(';')[0] ? (
            <h4>
              Enable Live Chat:{' '}
              <Button
                text={roomData.liveChatEnabled ? 'On' : 'Off'}
                onClick={handleLiveChat}
              />
            </h4>
          ) : (
            <h4>Live Chat: <span className='live-chat-indicator'>{roomData.liveChatEnabled ? 'On' : 'Off'} </span></h4>
          )}
        </div>
      ) : (
        <Card
          data={roomData.users}
          render={(item) => <h4>{item.userName} - <span title='System - ID'>{item.ipAddress.split('.')[3]}</span> <span style={{fontSize:'12px'}}>- {new Date(item.joinedDate).toLocaleString()}</span></h4>}
        />
      )}
    </div>
  );
};

export default EmpList;
