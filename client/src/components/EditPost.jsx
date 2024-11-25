import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { TempContext } from "@/Contexts/TempContext"
import { useContext, useState } from "react"

export function EditPostDialog({ OwnerId, PostId }) {
  const [Open, setOpen] = useState(false)
  const { PostsData, setPostsData } = useContext(TempContext)
  const EditPost = async () => {
    alert("Work in progress")
    // try {
    //   const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/editPost/${PostId}`, {
    //     OwnerId: OwnerId,
    //     NewDescription: "",
    //     NewPicturePath: ""
    //   })
    //   toast.success(response.data.message)
    //   const updatedPostsArr = PostsData.map((post) => post._id === PostId ? response.data.UpdatedPost : post)
    //   console.log("updatedPostsArr: ", updatedPostsArr);
    //   setOpen(false)
    //   // setPostsData(updatedPostsArr)
    // } catch (err) {
    //   console.log(err);
    // }
  }
  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="outline">Edit Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message-2">Description</Label>
            <Textarea placeholder="text..." id="message-2" />
          </div>
          <div className="grid w-full gap-1.5">
            <Input onChange={(e) => setProfilePicture(e.target.files[0])} id="picture" type="file" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={EditPost} type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
