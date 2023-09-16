import React from 'react'
import './styles.scss'

const Footer = () => {
  return (<div className='footer-main'>
    <div className='footer-data'>
        <div className='footer-logo'>
            <img alt='logo' src='https://www.seekpng.com/png/detail/26-261784_2-share-sharing-file-logo.png' />
            <h3>File-Share</h3>
        </div>
        <div className='footer-links'>
          <div className='section-1'>
            <h3>Links</h3>
            <ul>
              <li>Login</li>
              <li>Room</li>
              <li>Home</li>
            </ul>
          </div>
        </div>
    </div>
    <div className='copyright-tag'> &#169; Developed by Naresh Baleboina</div>
    </div>
  )
}

export default Footer