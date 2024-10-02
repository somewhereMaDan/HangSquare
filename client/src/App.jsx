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
  // const [cookies, setCookie] = useCookies(["access_Token"]);
  const location = useLocation(); // Moved useLocation inside the BrowserRouter

  const [redirectUserId, setRedirectUserId] = useState(null);
  const [PostsData, setPostsData] = useState([])
  const [UserInfo, setUserInfo] = useState([])
  const [cookies, setCookie] = useCookies(["access_Token"]);
  const [UserFriends, setUserFriends] = useState([])
  const [UserFriendsId, setUserFriendsId] = useState([])
  let UserId = userGetId()

  let ProfileInfo
  if (redirectUserId) {
    ProfileInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${redirectUserId}`,
          { headers: { authorization: cookies.access_Token } }
        )
        setUserInfo([response.data.UserInfo])
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    ProfileInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${UserId}`,
          { headers: { authorization: cookies.access_Token } }
        )
        setUserInfo([response.data.UserInfo])
      } catch (error) {
        console.log(error);
      }
    }
  }

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
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${redirectUserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setPostsData(response.data.UserPosts)
    } catch (err) {
      console.log(err);
    }
  }

  const GetUserFriends = async () => {
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

  // useEffect(() => {
  //   // Posts()
  //   ProfileInfo()
  //   GetUserFriends()
  //   if (redirectUserId !== null) {
  //     GetUserPosts()
  //   }else{
  //     Posts()
  //   }
  // }, [])
  useEffect(() => {
    ProfileInfo()
    GetUserFriends()

    if (redirectUserId !== null) {
      GetUserPosts()
    } else {
      Posts()
    }
  }, [redirectUserId]) // Adding redirectUserId to the dependency array


  return (
    <TempContext.Provider value={{ redirectUserId, setRedirectUserId, PostsData, setPostsData, UserInfo, setUserInfo, UserFriends, setUserFriends, UserFriendsId, setUserFriendsId, }}>
      {location.pathname !== '/' && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path='/' element={<Login />} />
        {/* {cookies.access_Token ? <Route path='/home' element={<Homepage />} /> : <Route path='/' element={<Login />} />} */}
        {cookies.access_Token && <Route path='/home' element={<Homepage />} />}
        <Route path='/redirectProfile' element={<RedirectProfile />} />
      </Routes>
    </TempContext.Provider>
  )
}

export default App;
