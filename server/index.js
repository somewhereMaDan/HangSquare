import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import { Auth } from "./routes/Auth.js";
import { UserRouter } from "./routes/Users.js";
import { PostRouter } from "./routes/Posts.js";
import { WebSocketServer } from 'ws'; // Use WebSocketServer explicitly for ES modules

const app = express();
dotenv.config()

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello from NodeJS" });
})

app.use("/auth", Auth)
app.use("/users", UserRouter)
app.use("/posts", PostRouter)

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
})

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Mongo DB is connected");
}).catch((err) => {
  console.log("database connection failed, error: ", err);
})