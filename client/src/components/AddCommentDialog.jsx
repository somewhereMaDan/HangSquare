import { React, useState, useEffect } from 'react'
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
import PostComment from '../assets/comment.png'
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie';

function AddCommentDialog({ PostId }) {
  const [Comment, setComment] = useState('')
  const UserId = userGetId();
  const [open, setOpen] = useState(false)  // Manage dialog state
  const [cookies, setCookie] = useCookies(["access_Token"]);

  const AddComment = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${UserId}/AddComment/${PostId}`, {
        comment: Comment
      }, { headers: { authorization: cookies.access_Token } })
      setOpen(false)
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Comment</Button> */}
          <p onClick={() => setOpen(true)}>Comment</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              {/* <Label htmlFor="name" className="text-right">
                Name
              </Label> */}
              <Input
                id="name"
                placeholder="enter comment"
                className="col-span-3"
                value={Comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={AddComment} type="submit">Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddCommentDialog