import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { joinRoomConfig } from './config';
import Input, { Button } from '../../common/input';
import { FormData } from './types';
import { joinRoomApi } from '../../store/api/RoomHandlerApi';
import { Severity } from '../../utils/Notification';
import {
  fetchRoomDataFailure,
  joinRoom,
} from '../../store/sliceFiles/RoomSlice';
import useNotification from '../../common/hooks/useNotification';
import { validator } from './helper';

export const INITIAL_OBJECT: FormData = {
  userName: '',
  roomId: '',
  isNewUser: true,
  userPassword: '',
  roomPassword: '',
  isProtected: false,
};

const JoinRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUserData } = useUserContext();
  const {updateNotification} = useNotification()
  const [formData, setFormData] = useState(INITIAL_OBJECT);
  const [errorMessage, setErrorMessage] = useState(INITIAL_OBJECT)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({...prev, [name]: checked}))
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleValidate = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log('validate:::');
  };
  const handleJoin = async () => {
    const {errors, isValid} = validator(formData, "JOIN")
    if (!isValid) {
      setErrorMessage(errors)
      return
    }
    setErrorMessage(INITIAL_OBJECT)
    const data = await joinRoomApi({ ...formData });
    console.log('data:::', data)
    if (data?.error) {
      updateNotification(data.error, Severity.ERROR)
      dispatch(fetchRoomDataFailure(data.error as string));
    } else if (data.roomId) {
      dispatch(joinRoom(data));
      updateNotification('Login Success', Severity.SUCCESS)
      const {userName, roomName= '', roomId, userPassword} = formData
      setUserData({userName, roomName, roomId, userPassword});
      localStorage.setItem('file-share-user', JSON.stringify(formData));
      navigate('/messages');
    }
  };
  console.log("erros::", errorMessage)
  return (
    <div>
      <h4>Join New Room: </h4>
      {joinRoomConfig.map((field) => {
        const { id, placeholder, type, label, required } = field;
        const name = field.name as keyof FormData;
        return (
          <div key={id}>
            <Input
              name={name}
              value={formData[name] as string}
              placeholder={placeholder}
              onBlur={handleValidate}
              onChange={handleChange}
              type={type}
              label={label}
              required={required}
              error={errorMessage[name] as string}
            />
          </div>
        );
      })}
      <Button text={'Join Room'} onClick={handleJoin} />
    </div>
  );
};

export default JoinRoom;
