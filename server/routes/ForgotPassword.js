import express from 'express'
import { ForgotPassReceiveToken, ForgotPassSendToken } from '../controller/ForgotPass.js'

const router = express()

router.post('/TokenSender', ForgotPassSendToken)
router.post('/TokenReceiver/:token', ForgotPassReceiveToken)

export { router as ForgotPassRouter }