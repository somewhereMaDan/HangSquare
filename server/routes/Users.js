import express from "express";
import { addRemoveFriend, CompleteProfile, GetUserFriends, GetUserInfo } from "../controller/users.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const router = express.Router()

router.get("/:id", VerifyToken, GetUserInfo)

router.get("/:id/friends", VerifyToken, GetUserFriends)

router.patch("/:UserId/addRemove/:friendId", addRemoveFriend)

router.patch("/:UserId/CompleteProfile", VerifyToken, CompleteProfile)

export { router as UserRouter }