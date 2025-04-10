import mongoose, { Mongoose } from "mongoose";

const VisiblitySchema = new mongoose.Schema({
  VisiblityType: {
    type: String,
    enum: ['ALL', 'PRIVATE', 'FRIENDS', 'CUSTOM'],
    default: 'ALL'
  },
  users: [{
    type: String,
    ref: 'users'
  }]
})

const ArticleSchema = new mongoose.Schema(
  {
    Owner: {
      type: String,
      ref: "users",
      required: true,
    },
    Topic: {
      type: String,
      required: true,
    },
    ArticleContent: {
      type: String,
    },
    PicturePath: {
      type: [String],
      default: [],
    },
    ArticleLikes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    ArticleComments: [
      {
        UserId: { type: String, required: true },
        Username: { type: String, required: true },
        CommentText: { type: String, required: true },
        CreatedAt: { type: Date, default: Date.now },
      },
    ],
    Visiblity: {
      type: [VisiblitySchema],
      // default: undefined // will trigger controller's fallback if not sent
    }
  },
  { timestamps: true }
);

export const ArticleModal = mongoose.model("articles", ArticleSchema);