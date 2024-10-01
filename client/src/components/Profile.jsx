import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { React, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Separator } from "@/components/ui/separator"
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import { toast } from 'sonner'
import ProfileSetting from '../assets/profile-setting.jpg'
import './Profile.css'
import RemoveFriendPic from '../assets/removeFriendTemp.png'
import LocationPic from '../assets/location.png'
import JobPic from '../assets/Job.png'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import EditProfileDialog from "./EditProfileDialog"
import { useCookies } from 'react-cookie'
import { TempContext } from '../Contexts/TempContext'

function Profile({ RedirectUserId }) {
  const { TempVar, setTempVar } = useContext(TempContext);

  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState([])
  const [UserFriends, setUserFriends] = useState([])
  const [cookies, setCookie] = useCookies(["access_Token"]);
  let UserId

  if (!RedirectUserId) {
    UserId = userGetId()
  } else {
    UserId = RedirectUserId
  }
  console.log(RedirectUserId);

  const ProfileInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${UserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setUserInfo([response.data.UserInfo])
    } catch (error) {
      console.log(error);
    }
  }

  const GetUserFriends = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${UserId}/friends`,
        { headers: { authorization: cookies.access_Token } }
      )
      setUserFriends(response.data.FriendsArr);
    } catch (err) {
      console.log(err);
    }
  }

  const RemoveFriend = async (FriendId) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${UserId}/addRemove/${FriendId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }

  const toggleRedirect = async (RedirectUserId) => {
    navigate('/redirectProfile', { state: { RedirectId: RedirectUserId } });
  }

  useEffect(() => {
    ProfileInfo()
    GetUserFriends()
  },
    [])
  // [UserFriends])
  return (
    <div className='whole-profile-info'>
      {
        UserInfo?.map((user) => {
          return (
            <div key={user._id} className='profile-information'>
              <div className='profile-first-line'>
                <div className='avatar-username'>
                  <div className='avatar'>
                    <Avatar>
                      <AvatarImage src={user.PicturePath} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='user-name-friends'>
                    <div className='username'>
                      <button onClick={() => toggleRedirect(user._id)}>{user.firstName}</button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Friends {user.Friends.length}
                    </p>
                  </div>
                </div>
                <div>
                  {
                    !RedirectUserId && <EditProfileDialog />
                  }
                </div>
              </div>
              <Separator className="my-4" />
              <div className='profile-second-line'>
                <p className="text-sm text-muted-foreground">
                  <span style={{ display: "flex", alignItems: "center", }}>
                    <span>
                      <img style={{ height: "1.8vh" }} src={LocationPic} />
                    </span>
                    <span style={{ paddingLeft: "1%" }}>{user.Location}</span>
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  <span style={{ display: "flex", alignItems: "center", }}>
                    <span>
                      <img style={{ height: "1.8vh" }} src={JobPic} />
                    </span>
                    <span style={{ paddingLeft: "1%" }}>{user.Occupation}</span>
                  </span>
                </p>
              </div>
              <Separator className="my-4" />
              <div className='profile-third-line'>
                <div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">Social Profiles</h4>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex h-5 items-center space-x-4 text-sm">
                    <div>
                      <a style={{ color: "palevioletred" }} target='_blank' href={user.SocialProfile['Instagram']}>Instagram</a>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <a style={{ color: "blue" }} target='_blank' href={user.SocialProfile['Linkdin']}>Linkdin</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
      <div>
        <div className='friend-list'>
          <h3>Friend List</h3>
          <Separator className="my-4" />
          {
            UserFriends.map((friend) => {
              return (
                <div key={friend._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '4%' }}>
                  <div>
                    <div>{friend.firstName} {friend.lastName}</div>
                    <p className="text-sm text-muted-foreground">
                      {friend.Bio}
                    </p>
                  </div>
                  <div>
                    {
                      !RedirectUserId && <button onClick={() => RemoveFriend(friend._id)}>
                        <img style={{ height: "2.5vh", borderRadius: "5px" }} src={RemoveFriendPic}></img>
                      </button>
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div >
  )
}

export default Profile