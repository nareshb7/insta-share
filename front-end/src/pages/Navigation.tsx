import React from 'react'
import './styles.scss'
import { Button } from '../utils/reusable/styles/Design'
import { useUserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const NavigationPage = () => {
  const userContext = useUserContext()
  const navigate =useNavigate()
  if(userContext == null) {
    return <div>Loading...</div>
  }
  const {setUserData, userData} = userContext
  const handleLogout = () => {
    localStorage.removeItem('file-share-user')
    navigate('/')
    setUserData({
      userName: '',
      roomName: '',
      roomId:''
    })

  }
  return (
    <nav className='nav-page'>
      <div className='nav-logo'>
        <img src='https://www.seekpng.com/png/detail/26-261784_2-share-sharing-file-logo.png' alt='share' />
      <span className='nav-header'>FILE-SHARE</span>
      </div>
      {
        userData.roomId &&  <div>
        <Button text='Logout' onClick={handleLogout}/>
      </div>
      }
    </nav>
  )
}

export default NavigationPage