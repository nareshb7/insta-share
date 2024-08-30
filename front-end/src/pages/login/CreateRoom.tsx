import React, { useState } from 'react';
import Input, { Button } from '../../common/input';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRoomApi } from '../../store/api/RoomHandlerApi';
import {
  fetchRoomDataFailure,
  joinRoom,
} from '../../store/sliceFiles/RoomSlice';
import { Severity } from '../../utils/Notification';
import { useUserContext } from '../../context/UserContext';
import { createRoomConfig } from './config';
import { FormData } from './types';
import useNotification from '../../common/hooks/useNotification';
import { generateRoomId, PASSWORD_PATTERN, ROOM_PATTERN, validator } from './helper';



export const INITIAL_OBJECT: FormData = {
  userName: '',
  roomId: '',
  roomName: '',
  userPassword: '',
  roomPassword: '',
  isProtected: false,
};

const CreateRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUserData } = useUserContext();
  const { updateNotification } = useNotification();
  const [formData, setFormData] = useState(INITIAL_OBJECT);
  const [errorMessage, setErrorMessage] = useState(INITIAL_OBJECT)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleValidate = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('validate:::', { name, value });
    let error= ""
    switch (name) {
      case "userName": {
        if (!value) {
          error = "User Name required"
        }
        break;
      }
      case "roomId": {
        if (!value.match(ROOM_PATTERN)) {
          error = "Room id not matching"
        }
      }
      case "roomName" : {
        if (!value) {
          error = "Room Name required"
        }
      }
      case "userPassword": {
        if (!value.match(PASSWORD_PATTERN)) {
          error = "Min 8 chars required"
        }
      }
      case "roomPassword": {
        if (!value.match(PASSWORD_PATTERN) && formData.isProtected) {
          error = "Min 8 chars required"
        }
      }
    }
  };
  const handleGenerateRoomId = () => {
    const roomId = generateRoomId();
    setFormData({ ...formData, roomId });
  };

  const handleCreate = async () => {
    const {errors, isValid} = validator(formData)
    console.log({errors, isValid})
    if (!isValid) {
      setErrorMessage(errors)
      return
    }
    setErrorMessage(INITIAL_OBJECT)
    const data = await createRoomApi({ ...formData });
    if (data?.error) {
      dispatch(fetchRoomDataFailure(data.error as string));
      updateNotification(data.error, Severity.ERROR);
    } else if (data.roomId) {
      dispatch(joinRoom(data));
      updateNotification('Room Created Successfully', Severity.SUCCESS);
      const { userName, roomName = '', roomId, userPassword } = formData;
      setUserData({ userName, roomName, roomId, userPassword });
      localStorage.setItem('file-share-user', JSON.stringify(formData));
      navigate('/messages');
    }
  };
  return (
    <div>
      <h4>Create New Room: </h4>
      <div>
        {createRoomConfig.map((field) => {
          const { id, placeholder, type, label, required } = field;
          const name = field.name as keyof FormData;
          return (
            <div key={id}>
              <Input
                name={name}
                value={formData[name] as string | boolean}
                error={errorMessage[name] as string}
                placeholder={placeholder}
                onBlur={handleValidate}
                onChange={handleChange}
                type={type}
                label={label}
                required={required}
              />
              {name === 'roomId' && (
                <Button
                  text="Generate Room Id"
                  onClick={handleGenerateRoomId}
                />
              )}
            </div>
          );
        })}
        <Button text={'Create Room'} onClick={handleCreate} />
      </div>
    </div>
  );
};

export default CreateRoom;
