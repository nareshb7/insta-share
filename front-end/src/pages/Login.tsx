import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { HandleChangeProps } from '../components/models/AuthModels';
import { useNavigate } from 'react-router-dom';
import { Button } from '../utils/reusable/styles/Design';
import { UserData } from '../context/Models';
import { useDispatch, useSelector } from 'react-redux';
import './styles.scss';
import { getPublicRoomsAction } from '../store/saga/Actions';
import {
  PublicRooms,
  fetchRoomDataFailure,
  fetchRoomDataStart,
  joinRoom,
} from '../store/sliceFiles/RoomSlice';
import { RootState } from '../store/Store';
import Card from '../utils/reusable/card/Card';
import { addNotification } from '../store/sliceFiles/Notification';
import { Severity } from '../utils/Notification';
import { createRoomApi, joinRoomApi } from '../store/api/RoomHandlerApi';

const Login = () => {
  const userContext = useUserContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomState = useSelector((state: RootState) => state.room);
  const { isLoading} = roomState;
  const [isNewRoom, setNewRoom] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<UserData>({
    userName: '',
    roomName: '',
    roomId: '',
    userPassword: '',
  });
  const [formData, setFormData] = useState<UserData>({
    userName: '',
    roomName: '',
    roomId: '',
    userPassword: '',
    password: '',
    isProtected: false,
  });
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getPublicRoomsAction());
  }, []);

  if (userContext === null) {
    // Handle the case where the context is null
    return <div>Loading...</div>; // or some other fallback
  }
  const { setUserData } = userContext;
  const handleChange = (e: HandleChangeProps) => {
    const { name, value } = e.target;
    setFormData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };
  const handleValidate = (): boolean => {
    let count = 0;
    if (!formData.userName) {
      setErrorMessage((prev) => ({ ...prev, userNameame: 'Name required' }));
      count++;
    } else {
      setErrorMessage((prev) => ({ ...prev, userName: '' }));
    }
    if (!formData.roomId) {
      setErrorMessage((prev) => ({ ...prev, roomId: 'Room Id required' }));
      count++;
    } else {
      setErrorMessage((prev) => ({ ...prev, roomId: '' }));
    }
    if (isNewRoom) {
      if (!formData.roomName) {
        setErrorMessage((prev) => ({
          ...prev,
          roomName: 'Room Name required',
        }));
        count++;
      } else {
        setErrorMessage((prev) => ({ ...prev, roomName: '' }));
      }
    }
    if (count) setBtnDisable(true);
    else setBtnDisable(false);
    return count === 0 ? true : false;
  };

  const handleJoin = async () => {
    dispatch(fetchRoomDataStart());
    formData.isProtected = isProtected;
    formData.password = password;
    if (isNewRoom) {
      const data = await createRoomApi({ ...formData, isProtected, password });
      if (data?.error) {
        dispatch(fetchRoomDataFailure(data.error as string));
        dispatch(
          addNotification({ content: data.error, severity: Severity.ERROR })
        );
      } else if (data.roomId) {
        dispatch(joinRoom(data));
        setUserData(formData);
        localStorage.setItem('file-share-user', JSON.stringify(formData));
        navigate('/messages');
      }
      formData.userName = `${formData.userName};${formData.password}`;
    } else {
      const data = await joinRoomApi({ ...formData, isProtected, password });
      if (data?.error) {
        dispatch(
          addNotification({ content: data.error, severity: Severity.ERROR })
        );
        dispatch(fetchRoomDataFailure(data.error as string));
      } else if (data.roomId) {
        dispatch(joinRoom(data));
        setUserData(formData);
        localStorage.setItem('file-share-user', JSON.stringify(formData));
        navigate('/messages');
      }
    }
    
  };
  const handleRoom = (status: boolean) => {
    setNewRoom(status);
    setShowForm(true);
    const emptyObejct = {
      userName: '',
      roomId: '',
      roomName: '',
      userPassword: '',
    };
    setErrorMessage(emptyObejct);
    setUserData(emptyObejct);
    setFormData(emptyObejct);
    setIsProtected(false);
    setPassword('');
    dispatch(fetchRoomDataFailure(''));
  };
  const handleCheckbox = () => {
    setIsProtected(!isProtected);
    setPassword('');
  };
  const handlePublicRoomClick =async (room: PublicRooms) => {
    const name = window.prompt('Enter your name??');
    if (name) {
      const obj = {
        userName: name.split(';')[0],
        roomId: room.roomId,
        roomName: room.roomName,
      };
      setUserData(obj);
      setNewRoom(false);
      setShowForm(true);
      setBtnDisable(false);
      const data = await joinRoomApi({ ...formData, isProtected, password });
      if (data?.error) {
        dispatch(
          addNotification({ content: data.error, severity: Severity.ERROR })
        );
        dispatch(fetchRoomDataFailure(data.error as string));
      } else if (data.roomId) {
        dispatch(joinRoom(data));
        setUserData(formData);
        localStorage.setItem('file-share-user', JSON.stringify(formData));
        navigate('/messages');
      }
    } else {
      dispatch(
        addNotification({
          content: 'Name Required',
          severity: Severity.ERROR,
        })
      );
    }
  };
  const roomsRender = (data: PublicRooms) => (
    <h5 key={data._id} onClick={() => handlePublicRoomClick(data)}>
      {data.roomName}
    </h5>
  );
  return (
    <div className="auth-page">
      <div className="login-page">
        <div>
          <Button text="Create Room" onClick={() => handleRoom(true)} />
          <Button text="Join Room" onClick={() => handleRoom(false)} />
        </div>
        {showForm && (
          <div>
            {isNewRoom ? (
              <h4>Create New Room: </h4>
            ) : (
              <h4>Enter Room Data: </h4>
            )}
            <div>
              <label>
                <input
                  className="form-control"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your name..."
                  onBlur={handleValidate}
                  onKeyUp={handleValidate}
                />
              </label>
              {isNewRoom && (
                <div>
                  <label>
                    <input
                      className="form-control"
                      name="userPassword"
                      value={formData.userPassword}
                      onChange={handleChange}
                      placeholder="Enter your password..."
                      onBlur={handleValidate}
                      onKeyUp={handleValidate}
                    />
                  </label>
                  <p className="info-message">
                    U need to pass this password with username when u r logging
                    in{' '}
                  </p>
                  <p>like test;123</p>
                </div>
              )}
              {!isNewRoom && (
                <div>
                  <label
                    style={{
                      color: roomState.error.includes('Someone has')
                        ? '#f00'
                        : '',
                    }}
                  >
                    If you are new user click here
                    <input
                      checked={isNewUser}
                      onChange={(e) => setIsNewUser(e.target.checked)}
                      type="checkbox"
                      style={{
                        color: roomState.error.includes('Someone has')
                          ? '#f00'
                          : '',
                      }}
                    />
                  </label>
                </div>
              )}
              <div className="error-message">{errorMessage.userName}</div>
            </div>
            <div>
              <label>
                <input
                  className="form-control"
                  name="roomId"
                  value={formData?.roomId}
                  onChange={handleChange}
                  placeholder="Enter room id..."
                  onBlur={handleValidate}
                  onKeyUp={handleValidate}
                />
              </label>
              <div className="error-message">{errorMessage.roomId}</div>
            </div>
            <div>
              <label>
                <input
                  className="form-control"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleChange}
                  placeholder="Enter room name..."
                  onBlur={handleValidate}
                  onKeyUp={handleValidate}
                  disabled={!isNewRoom}
                />
              </label>
              <div className="error-message">{errorMessage.roomName}</div>
            </div>
            <div>
              <label>
                {isNewRoom
                  ? 'Do u want it to be protected?'
                  : 'If its protected click checkbox to enter password'}
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
              text={isLoading ? '...' : isNewRoom ? 'Create' : 'Join'}
              onClick={handleJoin}
            />
            <div className="error-message">{roomState.error}</div>
          </div>
        )}
      </div>
      <div className="public-rooms">
        <h2>Public Rooms:</h2>
        {roomState.publicRooms.length > 0 ? (
          <Card data={roomState.publicRooms} render={roomsRender} />
        ) : (
          <h5>NO PUBLIC_ROOMS AVAILABLE</h5>
        )}
      </div>
    </div>
  );
};

export default Login;
