import mongoose from "mongoose";
import { type } from "os";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		author: {
			type: String,
			required: true
		},
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const MessageModal = mongoose.model("Message", messageSchema);

export default MessageModal;