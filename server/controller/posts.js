import { PostModel } from "../models/Posts.js"
import { UserModel } from "../models/Users.js"
import mongoose from "mongoose"

export const GetAllPosts = async (req, res) => {
  try {
    const allPosts = await PostModel.find({}).populate('Owner')
    return res.status(200).json({ allPosts })
  } catch (err) {
    return res.status(404).json({ error: err.message })
  }
}

export const GetUserPosts = async (req, res) => {
  try {
    const { UserId } = req.params

    const user = await UserModel.findById(UserId)
    // const Posts = user.OwnPosts

    const UserPosts = await PostModel.find({ Owner: UserId }).populate('Owner')

    return res.status(200).json({ message: "Posts Loaded", UserPosts })
  } catch (err) {
    return res.status(403).json({ error: err.message })
  }
}

export const CreatePost = async (req, res) => {
  try {
    const { UserId } = req.params;
    const { Title, Description, PicturePath, Location } = req.body

    const user = await UserModel.findById(UserId)

    const newPost = new PostModel({
      Owner: UserId,
      Title: Title || "",
      Description: Description || "",
      PicturePath: PicturePath || "",
      UserPicturePath: user.PicturePath || '',
      Location: Location || "",
      Likes: [],
      Comments: {}
    })
    await newPost.save()
    user.OwnPosts.push(newPost._id)
    await user.save()

    const PopulatedPost = await PostModel.findById(newPost._id).populate('Owner')
    return res.status(200).json({ message: "post created", post: PopulatedPost, user_posts: user.OwnPosts })
  } catch (err) {
    return res.status(404).json({ error: err.message })
  }
}

export const DeletePost = async (req, res) => {
  try {
    const { UserId } = req.body
    const { PostId } = req.params

    const post = await PostModel.findById(PostId).populate('Owner')

    if (!post) {
      return res.status(403).json({ error: "Post not found" })
    }

    if (post.Owner._id.toString() !== UserId) {
      return res.status(403).json({ message: "You're not authorized to delete this post" })
    }

    await PostModel.findByIdAndDelete(PostId)

    const updatedUser = await UserModel.findByIdAndUpdate(
      UserId,
      { $pull: { OwnPosts: PostId } },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(403).json({ message: "User not found for this post" })
    }

    return res.status(200).json({ message: "Post deleted Successfully", post: post })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const EditPost = async (req, res) => {
  const { PostId } = req.params;
  const { OwnerId, NewDescription, NewPicturePath } = req.body;


  try {
    if (!PostId || !NewDescription || !NewPicturePath) {
      return res.status(400).json({ message: 'PostId, Description, and PicturePath are required' });
    }

    const user = await UserModel.findById(OwnerId)

    if (!user.OwnPosts.includes(PostId)) {
      return res.status(401).json({ message: "You're not authorized to edit this post", ans: user.OwnPosts.includes(PostId) })
    }
    const post = await PostModel.findByIdAndUpdate(PostId, {
      Description: NewDescription,
      PicturePath: NewPicturePath
    }, { new: true }).populate('Owner')

    if (!post) {
      return res.status(400).json({ message: 'Unable to find post' })
    }

    return res.status(200).json({ message: 'Post Edited Successfully', UpdatedPost: post })
  } catch (err) {
    console.log(err);
  }
}

export const AddRemoveLikes = async (req, res) => {
  try {
    const { UserId, PostId } = req.params

    const post = await PostModel.findById(PostId).populate('Owner')

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    if (post.Likes.get(UserId)) {
      // post.Likes.set(UserId, false)
      post.Likes.delete(UserId)
    } else {
      post.Likes.set(UserId, true)
    }
    await post.save()

    return res.status(200).json({ message: "Like updated successfully", post })
  } catch (err) {
    return res.status(403).json({ error: err.message })
  }
}

export const AddComment = async (req, res) => {
  const { comment, CommentId } = req.body
  const { UserId, PostId } = req.params

  const user = await UserModel.findById(UserId)
  const post = await PostModel.findById(PostId).populate('Owner')

  if (!post) {
    return res.status(404).json({ message: "Post not found" })
  }

  // const commentId = new mongoose.Types.ObjectId();
  // need to change this get the "commentId" from frontend as use that as CommentId(Key) for Comments map(value)
  // so that in frontend we can update the state 

  // Add the comment to the Comments map
  post.Comments.set(CommentId.toString(), {
    UserId: UserId,
    Username: user.firstName + " " + user.lastName,
    CommentText: comment,
    CreatedAt: new Date()
  });
  await post.save()

  return res.status(200).json({ message: "Comment added successfully", post })
}

export const DeleteComment = async (req, res) => {
  try {
    const { UserId, PostId } = req.params
    const { CommentId } = req.body

    const post = await PostModel.findById(PostId).populate('Owner')

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    const comment = post.Comments.get(CommentId)

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" })
    }

    if (UserId !== comment.UserId) {
      return res.status(403).json({ error: "You're not authorized to delete this comment" })
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      PostId,
      {
        $unset: { [`Comments.${CommentId}`]: "" }  // Remove the comment from the map
      },
      { new: true }  // Return the updated document
    );

    return res.status(200).json({ message: "Comment Deleted", comment: comment, Post: updatedPost })
  } catch (err) {
    res.status(403).json({ error: err.message })
  }
}