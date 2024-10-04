import { React, useState, useEffect, createContext } from 'react'
import Advertisment from './Advertisment'
import Profile from './Profile'
import UserFeed from './OwnFeed'
import { useLocation } from 'react-router-dom';
import { RedirectContext } from '../Contexts/RedirectContext'
import { userGetId } from '@/hooks/userGetId';
import { useCookies } from 'react-cookie'
import axios from 'axios';
import ReProfile from './ReProfile';
import Feed from './Feed';

export const GlobalContext = createContext();
function RedirectProfile() {
  const location = useLocation();
  const RedirectUserId = location.state?.RedirectId;
  // console.log("RedirectUserId from RedirectProfile.jsx: ", RedirectUserId);
  const [RePostsData, setRePostsData] = useState([])
  const [ReUserInfo, setReUserInfo] = useState([])
  const [cookies, setCookie] = useCookies(["access_Token"]);
  const UserId = userGetId()


  const Posts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${RedirectUserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setRePostsData(response.data.UserPosts)
    } catch (err) {
      console.log(err);
    }
  }

  const ProfileInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${RedirectUserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setReUserInfo([response.data.UserInfo])
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    Posts()
    ProfileInfo()
  }, [])


  return (
      <div className='HomePage'>
        <div className='UserProfile'>
          <Profile></Profile>
        </div>
        <div className='Feed-Section'>
          <div>
            <Feed></Feed>
          </div>
        </div>
        <div className='Advertisment'>
          <Advertisment />
        </div>
      </div>
  )
}

export default RedirectProfile