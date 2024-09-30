import express from "express";
import { AddComment, AddRemoveLikes, CreatePost, DeleteComment, DeletePost, GetAllPosts, GetUserPosts } from "../controller/posts.js";

const router = express.Router()

router.get("/allPosts", GetAllPosts)

router.get("/:UserId", GetUserPosts)

router.post("/createPost/:UserId", CreatePost)

router.patch("/deletePost/:PostId", DeletePost)

router.patch("/:UserId/UpdateLike/:PostId", AddRemoveLikes)

router.patch("/:UserId/AddComment/:PostId", AddComment)

router.patch("/:UserId/DeleteComment/:PostId", DeleteComment)

export { router as PostRouter }