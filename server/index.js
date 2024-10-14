import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import { Auth } from "./routes/Auth.js";
import { UserRouter } from "./routes/Users.js";
import { PostRouter } from "./routes/Posts.js";
import path from 'path'
import { fileURLToPath } from 'url';
import { ChatRouter } from "./routes/message.js";
import { app, server } from './Socket/socket.js'

// const app = express();
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello from NodeJS" });
})

app.use("/auth", Auth)
app.use("/users", UserRouter)
app.use("/posts", PostRouter)
app.use('/ChatApp', ChatRouter)

// app.use(express.static(path.join(__dirname, 'client/dist')));

// Catch-all handler to send index.html for any other route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
// });

server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
})

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Mongo DB is connected");
}).catch((err) => {
  console.log("database connection failed, error: ", err);
})