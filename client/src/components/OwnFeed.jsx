import { React, useEffect, useState, useContext } from 'react'
import './Feed.css'
import axios from 'axios'
import './Profile.css'
import RemoveFriend from '../assets/removeFriendTemp.png'
import AddFriendPic from '../assets/AddFriend.png'
import OptionsImg from '../assets/option.png'
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
import { useCookies } from 'react-cookie';

function UserFeed({ RedirectUserId }) {
  const LoggedUserId = userGetId();
  const UserId = RedirectUserId
  const [PostsData, setPostsData] = useState([])
  const [cookies, setCookie] = useCookies(["access_Token"]);

  const Posts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${UserId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      setPostsData(response.data.UserPosts)
    } catch (err) {
      console.log(err);
    }
  }

  const RemoveAddLike = async (PostId) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${UserId}/UpdateLike/${PostId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }

  const DeleteComment = async (PostId, commentId) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${UserId}/DeleteComment/${PostId}`, {
        CommentId: commentId
      }, { headers: { authorization: cookies.access_Token } })
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }

  const DeletePost = async (PostId) => {
    console.log("Delte?");
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/deletePost/${PostId}`, {
        UserId: LoggedUserId
      }, { headers: { authorization: cookies.access_Token } })
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    Posts()
  }, [])
  return (
    <div className='whole-feed-div'>
      {
        PostsData && PostsData?.map((post, index) => {
          const LoggedUserId = userGetId()
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
                    <div className='username'>{post.Owner.firstName}</div>
                    <p className="text-sm text-muted-foreground">
                      {post.Owner.Location}
                    </p>
                  </div>
                </div>
                {
                  LoggedUserId === post.Owner._id &&
                  <div>
                    <button onClick={() => DeletePost(post._id)}>Delete</button>
                  </div>
                }
                {/* <div>
                  {
                    post.Owner._id !== UserId && <button onClick={() => RemoveAddFriend(post.Owner._id)}>
                      {
                        post.Owner.Friends.includes(UserId) ? <img style={{ height: "2.5vh", borderRadius: "5px" }} src={RemoveFriend} alt='Remove'></img> :
                          <img style={{ height: "2.5vh", borderRadius: "5px" }} src={AddFriendPic} alt='Remove'></img>
                      }
                    </button>
                  }
                </div> */}
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
                      {post.Comments && Object.entries(post.Comments).map(
                        ([commentId, commentData], Index) => (
                          <li key={commentId} className='comment-item'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div>
                                {
                                  commentData.UserId === LoggedUserId ? <button onClick={() => DeleteComment(post._id, commentId)}>
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
      //     : <div className='post-div' style={{ display: "flex", flexDirection: "column" }}>
      //   No posts yet
      // </div>
      }
    </div >
  )
}

export default UserFeed