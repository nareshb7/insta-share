import React from 'react'
import Card from '../../utils/reusable/Card';
import { UserData } from '../../context/Models';
import { RoomSliceState } from '../../store/sliceFiles/RoomSlice';

interface EmpListProps {
  userData: UserData
  roomData: RoomSliceState
}

const EmpList = ({userData, roomData}: EmpListProps ) => {

  return (
    <div className='emp-list'>
      <h2>User: <span style={{color:'#888'}}>{userData.userName}</span></h2>
      <hr />
      <h1 style={{color:'#444'}}>Members List: </h1>
      <hr />
      <Card data={roomData.users} render={(item)=> <h4>{item.userName}</h4>}/>
    </div>
  )
}

export default EmpList