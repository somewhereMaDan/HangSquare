import { React, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import showPasswordImg from '../assets/showPassword.png'

export default function PassReset() {
  const [Password, setPassword] = useState('')
  const { token } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(prevState => !prevState);
  };


  const TokenReceiver = async () => {
    if (Password.trim().length === 0) {
      toast.error('Passwords Field is empty');
      return
    }
    const isPasswordValid = passwordRegex.test(Password); // Direct validation
    if (isPasswordValid === false) {
      setPassword('')
      toast.error("Password must be at least 8 characters long and include a combination of uppercase and lowercase letters, numbers, and symbols.");
      return
    }
    toast.info("Changing Password, Please wait...")
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/forgotPassword/TokenReceiver/${token}`, {
        newPassword: Password
      })
      toast.success(response.data.message)
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh' }}>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>EZY</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="name">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <button onClick={togglePasswordVisibility}>
                    {showPassword ? <img src={showPasswordImg} /> : <img src={showPasswordImg} />}
                  </button>
                </div>
              </Label>
              <Input value={Password} type={showPassword ? 'text' : 'password'} id="name" onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* <Button variant="outline">Cancel</Button> */}
          <Button onClick={TokenReceiver}>Reset</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
