import jwt from 'jsonwebtoken'

export const VerifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err) => {
      if (err) return res.status(401).json({ message: "Unauthorized" })
      next()
    })
  } else {
    return res.status(404).json({ message: "token not provided" })
  }
}