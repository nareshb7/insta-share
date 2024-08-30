import React, { useState } from 'react';
import '../styles.scss';
import { Button } from '../../common/input';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import PublicRooms from './PublicRooms';

const Login = () => {
  const [showCreatePage, setShowCreatePage] = useState(true);
  const handleRoom = (status: boolean) => {
    setShowCreatePage(status);
  };
  return (
    <div className="auth-page">
      <div>
        <div>
          <Button className={showCreatePage ? "active": ""} text="Create Room" onClick={() => handleRoom(true)} />
          <Button className={!showCreatePage ? "active": ""} text="Join Room" onClick={() => handleRoom(false)} />
        </div>
        {showCreatePage ? <CreateRoom /> : <JoinRoom />}
      </div>
      <PublicRooms />
    </div>
  );
};

export default Login;
