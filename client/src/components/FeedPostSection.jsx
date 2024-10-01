import { React, useState, useEffect } from 'react'
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


function FeedPostSection() {
  const UserId = userGetId()
  const [UserInfo, setUserInfo] = useState([])
  const [ProfilePicture, setProfilePicture] = useState('')
  const [Description, setDescription] = useState('')
  const [cookies, setCookie] = useCookies(["access_Token"]);

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
    console.log("Image URL:", downloadURL);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/createPost/${UserId}`, {
        Description: Description,
        PicturePath: downloadURL
      }, { headers: { authorization: cookies.access_Token } })
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    ProfileInfo()
  }, [])

  return (
    <div>
      {
        UserInfo.map((user) => {
          return (
            <div key={user._id} style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between' }} className='avatar'>
              <div>
                <Avatar>
                  <AvatarImage src={user.PicturePath} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div style={{ width: "40%" }}>
                <Input onChange={(e) => setDescription(e.target.value)} value={Description} type="text" placeholder="What's on your Mind" />
              </div>
              <div className="grid max-w-sm items-center gap-1.5">
                <Input onChange={(e) => setProfilePicture(e.target.files[0])} id="picture" type="file" />
              </div>
              <div>
                <Button onClick={() => CreateNewPost()} type="submit">Post</Button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default FeedPostSection