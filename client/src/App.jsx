import { useState, useEffect, createContext } from 'react'
import './App.css'
import Login from './pages/Login'
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar';
import Homepage from './pages/Homepage';
import RedirectProfile from './components/RedirectProfile';
import { useCookies } from 'react-cookie'
import { userGetId } from './hooks/userGetId';
import { TempContext } from './Contexts/TempContext'
import axios from 'axios';
import io from 'socket.io-client'
import ChatSection from './pages/ChatSection';

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Content /> {/* Render a separate component to handle routing */}
      </BrowserRouter>
    </>
  )
}

export const GlobalContext = createContext();

function Content() {
  const location = useLocation(); // Moved useLocation inside the BrowserRouter
  const [redirectUserId, setRedirectUserId] = useState(null);
  const [PostsData, setPostsData] = useState([])
  const [UserInfo, setUserInfo] = useState([])
  const [cookies, setCookie] = useCookies(["access_Token"]);
  const [UserFriends, setUserFriends] = useState([])
  const [UserFriendsId, setUserFriendsId] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  let UserId = userGetId()

  // let ProfileInfo
  // if (redirectUserId) {
  //   ProfileInfo = async () => {
  //     try {
  //       const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${redirectUserId}`,
  //         { headers: { authorization: cookies.access_Token } }
  //       )
  //       setUserInfo([response.data.UserInfo])
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // } else {
  const ProfileInfo = async () => {
    setIsLoading(true);
    if (redirectUserId) {
      UserId = redirectUserId
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${UserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setUserInfo([response.data.UserInfo])
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }
  // }

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

  const GetUserPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${redirectUserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setPostsData(response.data.UserPosts)
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }

  const GetUserFriends = async () => {
    if (redirectUserId) {
      UserId = redirectUserId
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${UserId}/friends`,
        { headers: { authorization: cookies.access_Token } }
      )
      setUserFriends(response.data.FriendsArr);
      setUserFriendsId(response.data.FriendsId)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (UserId) {
      ProfileInfo();
      GetUserFriends();
      setIsLoading(false);
    } else {
      console.log("UserId is not available yet, waiting...");
    }

    if (redirectUserId !== null) {
      GetUserPosts();
    } else {
      Posts();
    }
  }, [redirectUserId, UserId]) // Adding redirectUserId to the dependency array


  return (
    <TempContext.Provider value={{ redirectUserId, setRedirectUserId, PostsData, setPostsData, UserInfo, setUserInfo, UserFriends, setUserFriends, UserFriendsId, setUserFriendsId, }}>
      {location.pathname !== '/' && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path='/' element={<Login />} />
        {/* {cookies.access_Token ? <Route path='/home' element={<Homepage />} /> : <Route path='/' element={<Login />} />} */}
        {cookies.access_Token && <Route path='/home' element={<Homepage />} />}
        <Route path='/redirectProfile' element={<RedirectProfile />} />
        <Route path='/ChatSection' element={<ChatSection />} />
      </Routes>
    </TempContext.Provider>
  )
}


export default App;
