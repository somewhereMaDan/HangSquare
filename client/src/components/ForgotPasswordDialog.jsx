import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { toast } from "sonner"
import { React, useState } from "react"

export default function ForgotPasswordDialog() {
  const [EmailId, setEmailId] = useState('')
  const [isOpen, setIsOpen] = useState(false) // State to manage dialog open/close

  const TokenSenderInMail = async () => {
    toast.info('Sending mail...')
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/forgotPassword/TokenSender`, {
        email: EmailId
      })
      console.log(response.data);
      toast.success(response.data.message)
      setIsOpen(false) // Close the dialog when the email is sent successfully
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Forgot your password?</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>We'll send a mail to your Account</DialogTitle>
          <DialogDescription>
            EZY
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email Id
            </Label>
            <Input
              id="email"
              onChange={(e) => setEmailId(e.target.value)}
              placeholder='example@gmail.com'
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={TokenSenderInMail} type="submit">Send Mail</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
