import express from "express";
import { UserModel } from "../models/Users.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, Password, Bio, PicturePath, Friends, OwnPosts, Occupation, Location, SocialProfile } = req.body;

  const ExistingUser = await UserModel.findOne({ email: email })

  if (ExistingUser) {
    return res.status(403).json({ message: "User already exists" })
  }

  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(Password, salt)

  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    Password: hashedPassword,
    Bio: Bio || "",
    PicturePath: PicturePath || "",
    Friends: Friends || [],
    OwnPosts: OwnPosts || [],
    Occupation: Occupation || "",
    Location: Location || "",
    SocialProfile: SocialProfile || {}
  })

  await newUser.save()

  return res.status(200).json({ message: "Registration Completed, please Login!" })
})

router.post("/login", async (req, res) => {
  try {
    const { email, Password } = req.body;
    const user = await UserModel.findOne({ email: email })

    if (!user) {
      return res.status(401).json({ error: "user does not exist" })
    }

    const isMatch = await bcrypt.compare(Password, user.Password)

    if (!isMatch) {
      return res.status(401).json({ error: "incorrect credentials" })
    }

    const token = jwt.sign({ UserId: user.id }, process.env.SECRET_KEY);

    res.status(200).json({ message: "Login Successfull", token: token, UserId: user.id })
  } catch (err) {
    return res.status(403).json({ error: err.message })
  }
})


export { router as Auth }