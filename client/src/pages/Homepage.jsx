import { React, useState, useEffect, createContext } from 'react'
import './Homepage.css'
import Profile from '@/components/Profile'
import Feed from '@/components/Feed'
import Advertisment from '@/components/Advertisment'
import FeedPostSection from '@/components/FeedPostSection'
import { TempContext } from '../Contexts/TempContext'
import { useCookies } from 'react-cookie'
import axios from 'axios'



export const GlobalContext = createContext();
function Homepage() {
  const [TempVar, setTempVar] = useState('Madan')
  const [PostsData, setPostsData] = useState([])
  const [cookies, setCookie] = useCookies(["access_Token"]);

  const Posts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/allPosts`,
        { headers: { authorization: cookies.access_Token } }
      )
      setPostsData(response.data.allPosts)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    Posts()
  }, [])

  return (
    <TempContext.Provider value={{ TempVar, setTempVar, PostsData, setPostsData }}>
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