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


export const GlobalContext = createContext();
function Homepage() {
  // const [TempVar, setTempVar] = useState('Madan')
  // const [PostsData, setPostsData] = useState([])
  // const [UserInfo, setUserInfo] = useState([])
  // const [cookies, setCookie] = useCookies(["access_Token"]);
  // const [UserFriends, setUserFriends] = useState([])
  // const [UserFriendsId, setUserFriendsId] = useState([])
  // const UserId = userGetId()

  // const ProfileInfo = async () => {
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${UserId}`,
  //       { headers: { authorization: cookies.access_Token } }
  //     )
  //     setUserInfo([response.data.UserInfo])
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const Posts = async () => {
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/allPosts`,
  //       { headers: { authorization: cookies.access_Token } }
  //     )
  //     setPostsData(response.data.allPosts)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // const GetUserFriends = async () => {
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${UserId}/friends`,
  //       { headers: { authorization: cookies.access_Token } }
  //     )
  //     setUserFriends(response.data.FriendsArr);
  //     setUserFriendsId(response.data.FriendsId)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // useEffect(() => {
  //   Posts()
  //   ProfileInfo()
  //   GetUserFriends()
  // }, [])

  return (
    // <TempContext.Provider value={{ TempVar, setTempVar, PostsData, setPostsData, UserInfo, setUserInfo, UserFriends, setUserFriends, UserFriendsId, setUserFriendsId,  }}>
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
    // </TempContext.Provider>
  )
}

export default Homepage