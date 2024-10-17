import { React, useState, useEffect, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import { ImgDb } from '../Firebase'
import { toast } from 'sonner';
import { useCookies } from 'react-cookie';
import { TempContext } from '../Contexts/TempContext'


function FeedPostSection() {
  const UserId = userGetId()
  const [ProfilePicture, setProfilePicture] = useState('')
  const [Description, setDescription] = useState('')
  const [cookies, setCookie] = useCookies(["access_Token"]);
  const { PostsData, setPostsData, UserInfo, setUserInfo } = useContext(TempContext)

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

  const CreateNewPost = async () => {
    toast.info("Uploading Post")
    const ImgRef = ref(ImgDb, `Pictures/${ProfilePicture.name}`)
    const snapshot = await uploadBytes(ImgRef, ProfilePicture);
    // Step 3: Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/createPost/${UserId}`, {
        Description: Description,
        PicturePath: downloadURL
      }, { headers: { authorization: cookies.access_Token } })
      toast.success(response.data.message)
      const newPost = response.data.post
      const tempPostsData = [...PostsData, newPost]
      setPostsData(tempPostsData)
      setDescription('')  // Clear description input
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (UserId) {
      ProfileInfo();
    }
  }, [UserId]);  // Add dependencies

  return (
    <div>
      {
        UserInfo.map((user) => {
          return (
            <div key={user._id} className='avatar'>
              <div className='avatar-icon'>
                <Avatar>
                  <AvatarImage style={{ objectFit: 'cover' }}  src={user.PicturePath} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className='post-description'>
                <Input onChange={(e) => setDescription(e.target.value)} value={Description} type="text" placeholder="What's on your Mind" />
              </div>
              <div className='post-pic-path'>
                <Input onChange={(e) => setProfilePicture(e.target.files[0])} id="picture" type="file" />
              </div>
              <div className='post-submit-btn'>
                <Button onClick={() => CreateNewPost(user._id)} type="submit">Post</Button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default FeedPostSection