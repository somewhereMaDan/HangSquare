import express from "express";
import { AddComment, AddRemoveLikes, CreatePost, DeleteComment, DeletePost, GetAllPosts, GetUserPosts } from "../controller/posts.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { version } from "mongoose";

const router = express.Router()

router.get("/allPosts", GetAllPosts)

router.get("/:UserId", VerifyToken, GetUserPosts)

router.post("/createPost/:UserId", VerifyToken, CreatePost)

router.patch("/deletePost/:PostId", VerifyToken, DeletePost)

router.patch("/:UserId/UpdateLike/:PostId", AddRemoveLikes)

router.patch("/:UserId/AddComment/:PostId", VerifyToken, AddComment)

router.patch("/:UserId/DeleteComment/:PostId", VerifyToken, DeleteComment)

export { router as PostRouter }