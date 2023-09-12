import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { HandleChangeProps } from '../components/models/AuthModels';
import { useNavigate } from 'react-router-dom';
import { Button } from '../utils/reusable/styles/Design';
import { UserData } from '../context/Models';
import { useDispatch, useSelector } from 'react-redux';
import './styles.scss';
import { createRoomAction, joinRoomAction } from '../store/saga/Actions';
import { fetchRoomDataFailure, fetchRoomDataStart } from '../store/sliceFiles/RoomSlice';
import { RootState } from '../store/Store';

const Login = () => {
  const userContext = useUserContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomState = useSelector((state: RootState) => state.room)
  const {isLoading, isSuccess, roomId} = roomState
  const [isNewRoom, setNewRoom] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const [roomName, setRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState<UserData>({
    userName: '',
    roomName: '',
    roomId: '',
  });
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(true);


useEffect(() => {
  console.log('ISSUCESS', roomState)
  if (isSuccess) {
    socket.emit('join-room', roomId)
    navigate('/messages')
  }
}, [isSuccess])

  if (userContext === null) {
    // Handle the case where the context is null
    return <div>Loading...</div>; // or some other fallback
  }
  const { userData, setUserData, socket } = userContext;
  const handleChange = (e: HandleChangeProps) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };
  const handleValidate = (): boolean => {
    let count = 0;
    if (!userData.userName) {
      setErrorMessage((prev) => ({ ...prev, userNameame: 'Name required' }));
      count++;
    } else {
      setErrorMessage((prev) => ({ ...prev, userName: '' }));
    }
    if (!userData.roomId) {
      setErrorMessage((prev) => ({ ...prev, roomId: 'Room Id required' }));
      count++;
    } else {
      setErrorMessage((prev) => ({ ...prev, roomId: '' }));
    }
    if (count) setBtnDisable(true);
    else setBtnDisable(false);
    return count === 0 ? true : false;
  };

  const handleJoin = () => {
    dispatch(fetchRoomDataStart())
    userData.roomName = roomName;
    userData.isProtected = isProtected
    userData.password = password
    if (isNewRoom) {
      dispatch(createRoomAction({ ...userData, isProtected, password }));
    } else {
      dispatch(joinRoomAction({...userData, isProtected, password, isNewUser}))
    }
    setUserData(userData)
    localStorage.setItem('file-share-user', JSON.stringify(userData))
    // navigate('/messages');
  };
  const handleRoom = (status: boolean) => {
    setNewRoom(status);
    setShowForm(true);
    const emptyObejct = {
      userName: '',
      roomId: '',
      roomName: '',
    };
    setErrorMessage(emptyObejct);
    setUserData(emptyObejct);
    setIsProtected(false)
    setRoomName('')
    setPassword('')
    dispatch(fetchRoomDataFailure(''))
  };
  const handleCheckbox = ()=> {
    setIsProtected(!isProtected)
    setPassword('')
  }
  return (
    <div className="auth-page">
      <div className="login-page">
        <div>
          <Button text="Create Room" onClick={() => handleRoom(true)} />
          <Button text="Join Room" onClick={() => handleRoom(false)} />
        </div>
        {showForm && (
          <div>
            {isNewRoom ? <h4>Create New Room: </h4> : <h4>Enter Room Id: </h4>}
            <div>
              <label>
                <input
                  className="form-control"
                  name="userName"
                  value={userData.userName}
                  onChange={handleChange}
                  placeholder="Enter your name..."
                  onBlur={handleValidate}
                  onKeyUp={handleValidate}
                />
              </label>
              
              {
                !isNewRoom && <div><label>If you are new user click here
                <input checked={isNewUser} onChange={(e)=> setIsNewUser(e.target.checked)} type='checkbox' />
              </label></div>
              }

              
              <div className="error-message">{errorMessage.userName}</div>
            </div>
            <div>
              <label>
                <input
                  className="form-control"
                  name="roomId"
                  value={userData?.roomId}
                  onChange={handleChange}
                  placeholder="Enter room id..."
                  onBlur={handleValidate}
                  onKeyUp={handleValidate}
                />
              </label>
              <div className="error-message">{errorMessage.roomId}</div>
            </div>
            {isNewRoom && (
              <div>
                <label>
                  <input
                    className="form-control"
                    name="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name..."
                  />
                </label>
              </div>
            )}
            <div>
              <label>
                {
                  isNewRoom ? 'Do u want it to be protected?': 'If its protected click checkbox to enter password'
                }
                <input
                  type="checkbox"
                  checked={isProtected}
                  onChange={handleCheckbox}
                />
              </label>
            </div>
            {isProtected && (
              <div>
                <input
                  className="form-control"
                  placeholder="Enter password..."
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            <Button
              disabled={btnDisable || isLoading}
              text={isLoading? '...' : isNewRoom ? 'Create' : 'Join'}
              onClick={handleJoin}
            />
            <div className='error-message'>{roomState.error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
