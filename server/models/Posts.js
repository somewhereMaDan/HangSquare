import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  Owner: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId, // Change to ObjectId
    ref: 'users',
    required: true,
  },
  Title: {
    type: String,
    default: ""
  },
  Description: {
    type: String,
    default: ""
  },
  PicturePath: {
    type: String,
    default: ""
  },
  UserPicturePath: {
    type: String,
  },
  Likes: {
    type: Map,
    of: Boolean,
    default: {}
  },
  Comments: {
    type: Map,  // This should be Map, not Array
    of: new mongoose.Schema({
      UserId: { type: String, required: true },
      Username: { type: String, required: true },
      CommentText: { type: String, required: true },
      CreatedAt: { type: Date, default: Date.now }
    }),
    default: {}  // Ensure it initializes as an empty object, not an empty array
  },
  Location: String
}, { timestamps: true })

export const PostModel = mongoose.model("posts", PostSchema)