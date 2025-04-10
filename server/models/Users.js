import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      // match: [/\S+@\S+\.\S+/, 'is invalid'],
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Bio: {
      type: String,
      default: "",
    },
    PicturePath: {
      type: String,
      default: "",
      required: true,
    },
    Friends: {
      type: Array,
      default: [],
    },
    SocialProfile: {
      type: Map,
      default: {},
    },
    OwnPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
    OwnArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "articles" }],
    Occupation: String,
    Location: String,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("users", UserSchema);
