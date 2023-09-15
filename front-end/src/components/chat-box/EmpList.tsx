import React, { useState } from 'react';
import Card from '../../utils/reusable/card/Card';
import { UserData } from '../../context/Models';
import { RoomSliceState } from '../../store/sliceFiles/RoomSlice';
import { Button } from '../../utils/reusable/styles/Design';

interface EmpListProps {
  userData: UserData;
  roomData: RoomSliceState;
}

const EmpList = ({ userData, roomData }: EmpListProps) => {
  const [showInfo, setShowInfo] = useState(true);
  return (
    <div className="emp-list">
      <h2 className='room-user'>
        User: <span style={{ color: '#888' }}>{userData.userName}</span>
      </h2>
      <hr />
      <h1 style={{ color: '#444' }}>Room Data: </h1>
      <hr />
      <div className='info-buttons'>
        <Button text={'Members'} onClick={() => setShowInfo(false)} />
        <Button text={'Info'} onClick={() => setShowInfo(true)} />
      </div>
      <hr />
      {showInfo ? (
        <div className='room-info'>
          <h4>RoomName : {roomData.roomName}</h4>
          <h4>RoomId : {roomData.roomId}</h4>
          <h4>Room Members: {roomData.users.length}</h4>
          <h4>Room Owner: {roomData.userName}</h4>
          <h4>Created On: {new Date(roomData.createdAt).toLocaleString()}</h4>
        </div>
      ) : (
        <Card
          data={roomData.users}
          render={(item) => <h4>{item.userName}</h4>}
        />
      )}
    </div>
  );
};

export default EmpList;
