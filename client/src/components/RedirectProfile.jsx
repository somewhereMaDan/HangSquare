import React from 'react'
import Advertisment from './Advertisment'
import Profile from './Profile'
import UserFeed from './OwnFeed'
import { useLocation } from 'react-router-dom';

function RedirectProfile() {
  const location = useLocation();
  const RedirectUserId = location.state?.RedirectId;
  console.log(RedirectUserId);

  return (
    <div className='HomePage'>
      <div className='UserProfile'>
        <Profile RedirectUserId={RedirectUserId}></Profile>
      </div>
      <div className='Feed-Section'>
        <div>
          <UserFeed RedirectUserId={RedirectUserId}></UserFeed>
        </div>
      </div>
      <div className='Advertisment'>
        <Advertisment />
      </div>
    </div>
  )
}

export default RedirectProfile