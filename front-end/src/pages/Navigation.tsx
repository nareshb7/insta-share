import React from 'react'
import './styles.scss'
import { Button } from '../utils/reusable/styles/Design'

const NavigationPage = () => {
  
  return (
    <nav className='nav-page'>
      <div className='nav-logo'>
        <img src='' alt='share' />
        <span className='nav-header'>FILE-SHARE</span>
      </div>
      <div>
        <Button text='Logout' onClick={()=> console.log('LOGOUT_CLICKED')}/>
      </div>
    </nav>
  )
}

export default NavigationPage