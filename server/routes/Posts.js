import express from "express";
import { AddComment, AddRemoveLikes, CreatePost, DeleteComment, DeletePost, GetAllPosts, GetUserPosts } from "../controller/posts.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const router = express.Router()

router.get("/allPosts", VerifyToken, GetAllPosts)

router.get("/:UserId", VerifyToken, GetUserPosts)

router.post("/createPost/:UserId", VerifyToken, CreatePost)

router.patch("/deletePost/:PostId", DeletePost)

router.patch("/:UserId/UpdateLike/:PostId", AddRemoveLikes)

router.patch("/:UserId/AddComment/:PostId", VerifyToken, AddComment)

router.patch("/:UserId/DeleteComment/:PostId", VerifyToken, DeleteComment)

export { router as PostRouter }