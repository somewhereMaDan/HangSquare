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
import { v4 as uuidv4 } from 'uuid';

function Feed() {
  let UserId = userGetId();
  let LoggedUserId = userGetId()

  const { PostsData, setPostsData, UserInfo, setUserInfo, UserFriends, setUserFriends, UserFriendsId, setUserFriendsId, redirectUserId, setRedirectUserId } = useContext(TempContext)
  // const [PostsData, setPostsData] = useState([])
  const navigate = useNavigate()
  const [cookies, setCookie] = useCookies(["access_Token"]);

  if (redirectUserId !== null) {
    UserId = redirectUserId
    LoggedUserId = redirectUserId
  }
  console.log("post data: ", PostsData);

  const RemoveAddFriend = async (PostOwnerId, Owner) => {
    let updatedFriendList;
    let updatedUserFriends;
    if (UserFriendsId.includes(PostOwnerId)) {
      // Remove the friend
      updatedFriendList = UserFriendsId.filter(friendsId => friendsId !== PostOwnerId);
      updatedUserFriends = UserFriends.filter(friend => friend._id !== PostOwnerId);
    } else {
      // Add the friend
      if (!UserFriends.some(friend => friend._id === Owner._id)) {
        updatedUserFriends = [...UserFriends, Owner];
      } else {
        updatedUserFriends = UserFriends; // No change needed if already present
      }
      updatedFriendList = [...UserFriendsId, PostOwnerId];
      // updatedUserFriends = [...UserFriends, Owner]
      // updatedFriendList = [...UserFriendsId, PostOwnerId];
    }

    setUserFriendsId(updatedFriendList)
    setUserFriends(updatedUserFriends)

    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${UserId}/addRemove/${PostOwnerId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      toast.success(response.data.message)
      // const updatedUser = response.data.SingleUser
      // const updatedUsers = UserInfo.filter((user) => {
      //   return user._id !== PostOwnerId ? updatedUser : user
      // })
      // setUserInfo(updatedUsers)
    } catch (err) {
      console.log(err);
    }
  }

  const RemoveAddLike = async (PostId) => {
    if (!PostId) {
      console.error("PostId is undefined or invalid");
      return;
    }
    // const updatedPosts = PostsData.map((post) => {
    //   if (post) {
    //     if (post._id === PostId) {
    //       if (post.Likes) {
    //         const UpdatedLikes = { ...post.Likes, [UserId]: !post?.Likes[UserId] }
    //         return { ...post, Likes: UpdatedLikes }
    //       }
    //     }
    //   }
    //   return post
    // })
    // setPostsData(updatedPosts)

    // this above approch maintains Immutability and avoid Direct Mutation - Preferable when using state management libraries that require state to be immutable, as it helps prevent unintended side effects and makes debugging easier.

    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${UserId}/UpdateLike/${PostId}`,
        { headers: { authorization: cookies.access_Token } }
      )
      toast.success(response.data.message)
      const updatedPost = response.data.post;

      const updatedPosts = PostsData.map((post) => {
        return post._id === PostId ? updatedPost : post
      })
      setPostsData(updatedPosts)
    } catch (err) {
      console.log(err);
    }
  }

  const DeleteComment = async (PostId, commentId) => {
    // const updatedPosts = PostsData?.map((post) => {
    //   if (post._id === PostId) {
    //     const CommentMap = { ...post.Comments }
    //     if (CommentMap[commentId]) {
    //       delete CommentMap[commentId]
    //     }
    //     return { ...post, Comments: CommentMap }
    //   }
    //   return post
    // })
    // setPostsData(updatedPosts)
    console.log("PostsData after update: ", PostsData);
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${UserId}/DeleteComment/${PostId}`, {
        CommentId: commentId
      }, { headers: { authorization: cookies.access_Token } })
      toast.success(response.data.message)
      const updatedPost = response.data.Post
      const updatedPosts = PostsData.map((post) => {
        return post._id === PostId ? updatedPost : post
      })
      setPostsData(updatedPosts)
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
      // const updatedPost = response.data.post
      const updatedPosts = PostsData.filter((post) => {
        return post._id !== PostId
      })
      console.log("updatedPosts: ", updatedPosts);
      setPostsData(updatedPosts)
    } catch (err) {
      console.log(err);
    }
  }

  const toggleRedirect = async (ToRedirectUserId) => {
    navigate('/redirectProfile', { state: { RedirectId: ToRedirectUserId } });
    setRedirectUserId(ToRedirectUserId)

  }
  return (
    <div className='whole-feed-div'>
      {
        PostsData && PostsData?.map((post, index) => {
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
                    LoggedUserId === post.Owner._id &&
                    <div>
                      <button style={{ marginRight: "3vw" }} className='button-52' onClick={() => DeletePost(post._id)}>Delete</button>
                    </div>
                  }
                  {/* {console.log("User Friends: " + UserFriendsId + " post owner is: " + post.Owner._id)} */}
                  {
                    post.Owner._id !== UserId && <button onClick={() => RemoveAddFriend(post.Owner._id, post.Owner)}>
                      {/* {
                      post.Owner.Friends.includes(LoggedUserId) ? <img style={{ height: "2.5vh", borderRadius: "5px" }} src={RemoveFriend} alt='Remove' /> :
                        post.Owner._id !== UserId && <img style={{ height: "2.5vh", borderRadius: "5px" }} src={AddFriendPic} alt='Remove'></img>
                    } */}
                      {
                        UserFriendsId.includes(post.Owner._id) ? <img style={{ height: "2.5vh", borderRadius: "5px" }} src={RemoveFriend} alt='Remove' />
                          : <img style={{ height: "2.5vh", borderRadius: "5px" }} src={AddFriendPic} alt='Remove'></img>
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
                  {
                    Object.keys(post.Likes).length !== 0 ? <div>{Object.keys(post.Likes).length}</div> : ""
                  }
                  <button onClick={() => RemoveAddLike(post._id)} style={{ display: "flex", alignItems: "center", paddingLeft: "1%" }}>
                    {
                      post?.Likes && !post.Likes[UserId] ? <>
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
                  {post.Comments && Object.entries(post.Comments).length === 0 ? (
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

                      {post.Comments && Object.entries(post.Comments)?.map(
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