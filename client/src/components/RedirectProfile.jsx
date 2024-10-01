import { React, useState, useEffect, createContext } from 'react'
import Advertisment from './Advertisment'
// import Profile from './Profile'
import UserFeed from './OwnFeed'
import { useLocation } from 'react-router-dom';
import { RedirectContext } from '../Contexts/RedirectContext'
import { userGetId } from '@/hooks/userGetId';
import { useCookies } from 'react-cookie'
import axios from 'axios';
import ReProfile from './ReProfile';

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
    <RedirectContext.Provider value={{ RePostsData, setRePostsData, ReUserInfo, setReUserInfo }}>
      <div className='HomePage'>
        <div className='UserProfile'>
          <Profile RedirectUserId={RedirectUserId}></Profile>
          {/* <ReProfile /> */}
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
    </RedirectContext.Provider>
  )
}

export default RedirectProfile