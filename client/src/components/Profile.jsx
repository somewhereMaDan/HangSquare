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

export default function Profile() {
  const [ToggleValue, setToggleValue] = useState(false)
  const [TempUserId, setTempUserId] = useState('')
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["access_Token"]);
  const { UserInfo, setUserInfo, UserFriends, setUserFriends, UserFriendsId, setUserFriendsId, setRedirectUserId, redirectUserId } = useContext(TempContext)

  let UserId

  const LoggedUserId = userGetId()

  if (!redirectUserId) {
    UserId = LoggedUserId
  } else {
    UserId = redirectUserId
  }

  const RemoveFriend = async (FriendId) => {
    let updatedFriendList;
    if (UserFriendsId.includes(FriendId)) {
      updatedFriendList = UserFriendsId.filter(Id => Id !== FriendId);
    }
    setUserFriendsId(updatedFriendList)
    toast.info("Updating Friend List")

    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${UserId}/addRemove/${FriendId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }
  const toggleRedirect = async (ToRedirectUserId) => {
    setRedirectUserId(ToRedirectUserId);
  };

  useEffect(() => {
    if (redirectUserId) {
      // Once redirectUserId is set, navigate to the redirectProfile page
      // navigate('/redirectProfile', { state: { RedirectId: redirectUserId } });
      navigate(`/redirectProfile?redirectId=${redirectUserId}`);
    }
  }, [redirectUserId]); // Trigger this effect whenever redirectUserId changes


  const loggedUserFriendsCount = UserFriendsId.length;
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
                      <AvatarImage style={{ objectFit: 'cover' }}  src={user.PicturePath} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='user-name-friends'>
                    <div className='username'>
                      <button onClick={() => toggleRedirect(user._id)}>{user.firstName}</button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Friends {loggedUserFriendsCount}
                    </p>
                  </div>
                </div>
                <div>
                  {
                    LoggedUserId === UserId && <EditProfileDialog />
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
            UserFriends?.map((friend) => {
              if (UserFriendsId.includes(friend._id)) {
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
                        LoggedUserId === UserId && <button onClick={() => RemoveFriend(friend._id)}>
                          <img style={{ height: "2.5vh", borderRadius: "5px" }} src={RemoveFriendPic}></img>
                        </button>
                      }
                    </div>
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    </div >
  )
}