import React from 'react'
import Card from '../../utils/reusable/Card';
import { UserData } from '../../context/Models';

const mockUsers: UserData = {
  userName:'Naresh Baleboina',
  roomName: '010001',
  roomId:'Room No .1'
}
interface EmpListProps {
  userData: UserData
}

const EmpList = ({userData}: EmpListProps ) => {
  

  return (
    <div className='emp-list'>
      <h2>{userData.userName}</h2>
      <h2>Employee List</h2>
      <Card data={Array(10).fill(mockUsers)} render={(item)=> <h4>{item.name}</h4>}/>
    </div>
  )
}

export default EmpList