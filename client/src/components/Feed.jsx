import { React, useEffect, useState, useContext } from 'react'
import './Feed.css'
import axios from 'axios'
import './Profile.css'
import RemoveFriend from '../assets/removeFriendTemp.png'
import AddFriendPic from '../assets/AddFriend.png'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import PostLike from '../assets/Like.png'
import PostLiked from '../assets/Liked.png'
import PostComment from '../assets/comment.png'
import { Separator } from "@/components/ui/separator"
import { userGetId } from '@/hooks/userGetId'
import { toast } from 'sonner'
import AddCommentDialog from './AddCommentDialog'
import DeleteCommentPic from '../assets/delete.png'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { TempContext } from '../Contexts/TempContext'

function Feed() {
  const UserId = userGetId();
  const { PostsData, setPostsData } = useContext(TempContext)
  // const [PostsData, setPostsData] = useState([])
  const navigate = useNavigate()
  const [cookies, setCookie] = useCookies(["access_Token"]);

  console.log("post data: ", PostsData);

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

  const RemoveAddFriend = async (FriendId) => {
    console.log("remove friend clicked");
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${UserId}/addRemove/${FriendId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }

  const RemoveAddLike = async (PostId) => {
    const updatedPosts = PostsData.map((post) => {
      if (post) {
        if (post._id === PostId) {
          const UpdatedLikes = { ...post.Likes, [UserId]: !post.Likes[UserId] }
          return { ...post, Likes: UpdatedLikes }
        }
      }
      return post
    })
    setPostsData(updatedPosts)
    // this above approch maintains Immutability and avoid Direct Mutation - Preferable when using state management libraries that require state to be immutable, as it helps prevent unintended side effects and makes debugging easier.

    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${UserId}/UpdateLike/${PostId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      console.log("Like updated: ", response.data.post);
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }

  const DeleteComment = async (PostId, commentId) => {
    const updatedPosts = PostsData?.map((post) => {
      if (post._id === PostId) {
        const CommentMap = { ...post.Comments }
        console.log("Comment Map Object: ", CommentMap);
        if (CommentMap[commentId]) {
          delete CommentMap[commentId]
        }
        return { ...post, Comments: CommentMap }
      }
      return post
    })
    setPostsData(updatedPosts)
    try {
      console.log("post id: ", PostId);
      console.log("comment id: ", commentId);
      console.log("user id : ", UserId);
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${UserId}/DeleteComment/${PostId}`, {
        CommentId: commentId
      }, { headers: { authorization: cookies.access_Token } })
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }

  const toggleRedirect = async (RedirectUserId) => {
    navigate('/redirectProfile', { state: { RedirectId: RedirectUserId } });
  }
  
  return (
    <div className='whole-feed-div'>
      {
        PostsData?.map((post, index) => {
          return (
            <div key={post._id} className='post-div' style={{ display: "flex", flexDirection: "column" }}>
              <div className='profile-first-line'>
                <div className='avatar-username'>
                  <div className='avatar'>
                    <Avatar>
                      <AvatarImage src={post.Owner.PicturePath} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='user-name-friends'>
                    <button onClick={() => toggleRedirect(post.Owner._id)}>
                      <div className='username'>{post.Owner.firstName}</div>
                    </button>
                    <p className="text-sm text-muted-foreground">
                      {post.Owner.Location}
                    </p>
                  </div>
                </div>
                <div>
                  {
                    post.Owner._id !== UserId && <button onClick={() => RemoveAddFriend(post.Owner._id)}>
                      {
                        post.Owner.Friends.includes(UserId) ? <img style={{ height: "2.5vh", borderRadius: "5px" }} src={RemoveFriend} alt='Remove'></img> :
                          <img style={{ height: "2.5vh", borderRadius: "5px" }} src={AddFriendPic} alt='Remove'></img>
                      }
                    </button>
                  }
                </div>
              </div>
              <div className='Whole-Post-Section'>
                <div className='Post-Description' style={{ marginTop: "3%" }}>{post.Description}</div>
                <div className='Post-Img-Section' style={{ display: "flex", justifyContent: "center", marginTop: "1%", marginBottom: "2%" }}>
                  <div>
                    <img src={post.PicturePath}></img>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <button onClick={() => RemoveAddLike(post._id)} style={{ display: "flex", alignItems: "center" }}>
                    {
                      !post.Likes[UserId] ? <>
                        <div>
                          <img style={{ height: "2vh" }} src={PostLike} />
                        </div>
                        <div style={{ marginLeft: "0.5vw" }}>
                          Like
                        </div>
                      </> :
                        <>
                          <div>
                            <img style={{ height: "2vh" }} src={PostLiked} />
                          </div>
                          <div style={{ marginLeft: "0.5vw" }}>
                            Like
                          </div>
                        </>
                    }
                  </button>
                  <button style={{ display: "flex", alignItems: "center", paddingLeft: "2%" }}>
                    <div>
                      <img style={{ height: "2vh" }} src={PostComment} />
                    </div>
                    <div style={{ marginLeft: "0.5vw" }}>
                      <AddCommentDialog PostId={post._id}>Comment</AddCommentDialog>
                    </div>
                  </button>

                </div>
                <div className='comments-section'>
                  <div style={{ marginTop: "3%" }}>
                    <b>Comments</b>
                  </div>
                  <Separator className="my-4" />
                  {Object.entries(post.Comments).length === 0 ? (
                    <p>No comments yet.</p>
                  ) : (
                    <ul>
                      {/* Object.entries(): This function converts an object's key-value pairs into an array of arrays, where each inner array consists of [key, value]. In your case, Object.entries(post.Comments) would return something like this: */}
                      {/* from this -

                      post.Comments = {
                        "commentId1": { UserId: "user1", Username: "John", CommentText: "Great post!", CreatedAt: "2023-09-29T14:21:00" },
                        "commentId2": { UserId: "user2", Username: "Doe", CommentText: "Thanks for sharing!", CreatedAt: "2023-09-29T15:05:00" }
                      }; */}


                      {/* 
                      To this -

                      [
                        ["commentId1", { UserId: "user1", Username: "John", CommentText: "Great post!", CreatedAt: "2023-09-29T14:21:00" }],
                        ["commentId2", { UserId: "user2", Username: "Doe", CommentText: "Thanks for sharing!", CreatedAt: "2023-09-29T15:05:00" }]
                      ] */}

                      {Object.entries(post.Comments).map(
                        ([commentId, commentData], Index) => (
                          <li key={commentId} className='comment-item'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div>
                                {
                                  commentData.UserId === UserId ? <button onClick={() => DeleteComment(post._id, commentId)}>
                                    <img style={{ height: '3vh' }} src={DeleteCommentPic}></img>
                                  </button> : ""
                                }

                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', width: "100%", marginLeft: '2%' }} className='comment-details'>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    {commentData.Username}
                                  </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  {/* <div> */}
                                  <div>
                                    {commentData.CommentText}
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      {/* <strong>On:</strong>{' '} */}
                                      {new Date(commentData.CreatedAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Separator className="my-2" />
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )
        })
      }
    </div >
  )
}

export default Feed