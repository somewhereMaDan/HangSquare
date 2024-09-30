import express from "express";
import { addRemoveFriend, CompleteProfile, GetUserFriends, GetUserInfo } from "../controller/users.js";

const router = express.Router()

router.get("/:id", GetUserInfo)

router.get("/:id/friends", GetUserFriends)

router.patch("/:UserId/addRemove/:friendId", addRemoveFriend)

router.patch("/:UserId/CompleteProfile", CompleteProfile)

export { router as UserRouter }