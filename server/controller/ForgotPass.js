import { UserModel } from "../models/Users.js"
import jwt from 'jsonwebtoken'
import nodemailer, { createTransport } from 'nodemailer'
import bycrpt from 'bcrypt'

export const ForgotPassSendToken = async (req, res) => {
  const { email } = req.body

  try {
    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'User does not exist or invalid Email Id' })
    }
    const resetToken = jwt.sign({ UserId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })

    const resetLink = `${process.env.CLIENT_URL}/reset-link-to-change-password/${resetToken}`

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      to: user.email,
      subject: 'HangSquare Password Reset',
      html: `<p>Click <a href="${resetLink}"here</a> to reset your password</p>`
    })

    return res.status(200).json({ message: 'Password reset link has been sent to your mail' })
  } catch (err) {
    console.log('Error from ForgotPass.js', err);
    return res.status(403).json({ error: err.message })
  }
}

export const ForgotPassReceiveToken = async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    const user = await UserModel.findById(decoded.UserId)

    const salt = await bycrpt.genSalt(10)

    const newHashedPass = await bycrpt.hash(newPassword, salt)

    user.Password = newHashedPass
    await user.save()

    return res.status(200).json({ message: 'Password reset successfull, Please Login Now!' })
  } catch (err) {
    console.log('Error from ForgotPass.js', err);
    return res.status(403).json({ error: err.message })
  }
}