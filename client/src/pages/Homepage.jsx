import { React, useState, useEffect, createContext } from 'react'
import './Homepage.css'
import Profile from '@/components/Profile'
import Feed from '@/components/Feed'
import Advertisment from '@/components/Advertisment'
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import FeedPostSection from '@/components/FeedPostSection'

export const GlobalContext = createContext();
function Homepage() {
  return (
    <div className='HomePage'>
      <div className='UserProfile'>
        <Profile />
      </div>
      <div className='Feed-Section'>
        <div className='Feed-Post-Section'>
          {/* <div>POST</div> */}
          <FeedPostSection />
        </div>
        <div>
          <Feed />
        </div>
      </div>
      <div className='Advertisment'>
        <Advertisment />
      </div>
    </div>
  )
}

export default Homepage