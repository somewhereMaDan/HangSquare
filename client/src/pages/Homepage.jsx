import { React, useState, useEffect, createContext } from 'react'
import './Homepage.css'
import Profile from '@/components/Profile'
import Feed from '@/components/Feed'
import Advertisment from '@/components/Advertisment'
import FeedPostSection from '@/components/FeedPostSection'
import { TempContext } from '../Contexts/TempContext'



export const GlobalContext = createContext();
function Homepage() {
  const [TempVar, setTempVar] = useState('Madan')
  return (
    <TempContext.Provider value={{ TempVar, setTempVar }}>
      <div className='HomePage'>
        <div className='UserProfile'>
          <Profile />
        </div>
        <div className='Feed-Section'>
          <div className='Feed-Post-Section'>
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
    </TempContext.Provider>
  )
}

export default Homepage