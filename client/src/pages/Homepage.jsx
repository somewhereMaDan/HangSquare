import { React, useState, useEffect, createContext } from 'react'
import './Homepage.css'
import Feed from '@/components/Feed'
import Advertisment from '@/components/Advertisment'
import FeedPostSection from '@/components/FeedPostSection'
import { TempContext } from '../Contexts/TempContext'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import Profile from '@/components/Profile'
import { useSocketContext } from '@/Contexts/SocketContext'


export const GlobalContext = createContext();
function Homepage() {
  const { OnlineUsers, socket } = useSocketContext()
  console.log('App.jsx: ', OnlineUsers);
  return (
      <div className='HomePage'>
        <div className='UserProfile'>
          <Profile></Profile>
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
  )
}

export default Homepage