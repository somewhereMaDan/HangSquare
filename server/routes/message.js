import express from "express";
import { getMessages, sendMessage } from "../controller/message.js";
const router = express.Router();

router.post("/:id", getMessages);
router.post("/send/:id", sendMessage);

export { router as ChatRouter }