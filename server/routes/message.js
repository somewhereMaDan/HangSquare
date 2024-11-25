import express from "express";
import { deleteMessage, getMessages, sendMessage } from "../controller/message.js";
const router = express.Router();

router.post("/:id", getMessages);
router.post("/send/:id", sendMessage);
router.post("/delete/:id", deleteMessage)

export { router as ChatRouter }