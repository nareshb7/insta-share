import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import Card from '../../utils/reusable/card/Card';
import { joinRoomApi } from '../../store/api/RoomHandlerApi';
import {
  fetchRoomDataFailure,
  joinRoom,
  PublicRooms,
} from '../../store/sliceFiles/RoomSlice';
import { addNotification } from '../../store/sliceFiles/Notification';
import { Severity } from '../../utils/Notification';
import { useNavigate } from 'react-router-dom';
import { getPublicRoomsAction } from '../../store/saga/Actions';

const PublicRooms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roomState = useSelector((state: RootState) => state.room);
  const handlePublicRoomClick = async (room: PublicRooms) => {
    const name = window.prompt('Enter your name??');
    if (name) {
      const obj = {
        userName: name.split(';')[0],
        roomId: room.roomId,
        roomName: room.roomName,
      };
      const data = await joinRoomApi({ ...obj, isProtected: false });
      if (data?.error) {
        dispatch(
          addNotification({ content: data.error, severity: Severity.ERROR })
        );
        dispatch(fetchRoomDataFailure(data.error as string));
      } else if (data.roomId) {
        dispatch(joinRoom(data));
        dispatch(
          addNotification({
            content: 'Login Success',
            severity: Severity.SUCCESS,
          })
        );
        // setUserData({ ...formData,...obj, isProtected, password });
        localStorage.setItem('file-share-user', JSON.stringify(obj));
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
  useEffect(() => {
    dispatch(getPublicRoomsAction());
  }, []);
  return (
    <div className="public-rooms">
      <h2 title="These are the rooms created without password">
        Public Rooms:
      </h2>
      {roomState.publicRooms.length > 0 ? (
        <Card data={roomState.publicRooms} render={roomsRender} />
      ) : (
        <h5>NO PUBLIC_ROOMS AVAILABLE</h5>
      )}
    </div>
  );
};

export default PublicRooms;
