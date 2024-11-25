import { React, useState, useEffect, createContext, useContext } from 'react'
import Advertisment from './Advertisment'
import Profile from './Profile'
import UserFeed from './OwnFeed'
import { useSearchParams } from 'react-router-dom';
import { RedirectContext } from '../Contexts/RedirectContext'
import { userGetId } from '@/hooks/userGetId';
import { useCookies } from 'react-cookie'
import axios from 'axios';
import ReProfile from './ReProfile';
import Feed from './Feed';
import { TempContext } from '@/Contexts/TempContext';

export const GlobalContext = createContext();
function RedirectProfile() {
  // const { redirectUserId } = useContext(TempContext)
  const [searchParams] = useSearchParams();
  const redirectUserId = searchParams.get('redirectId');
  const [RePostsData, setRePostsData] = useState([])
  const [ReUserInfo, setReUserInfo] = useState([])
  const [cookies, setCookie] = useCookies(["access_Token"]);
  const UserId = userGetId()


  const Posts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${redirectUserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setRePostsData(response.data.UserPosts)
    } catch (err) {
      console.log(err);
    }
  }

  const ProfileInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${redirectUserId}`,
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