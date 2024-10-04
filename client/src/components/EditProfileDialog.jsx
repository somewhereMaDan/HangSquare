import { useState, useEffect, React, useContext } from 'react'
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
import axios from 'axios'
import { userGetId } from '@/hooks/userGetId'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie';
import { TempContext } from '../Contexts/TempContext'

function EditProfileDialog() {
  const UserId = userGetId()
  const [Occupation, setOccupation] = useState('')
  const [Location, setLocation] = useState('')
  const [Linkdin, setLinkdin] = useState('')
  const [Insta, setInsta] = useState('')
  const [open, setOpen] = useState(false)  // Manage dialog state
  const [cookies, setCookie] = useCookies(["access_Token"]);
  const { UserInfo, setUserInfo } = useContext(TempContext)

  const EditProfile = async () => {
    toast.info("Saving Changes, Please wait...")
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/${UserId}/CompleteProfile`, {
        Location: Location,
        Occupation: Occupation,
        Instagram: Insta,
        Linkdin: Linkdin
      }, { headers: { authorization: cookies.access_Token } })
      setOpen(false)
      const updatedUserInfo = response.data.user
      // const tempData = UserInfo.filter((user) => {
      //   return user._id === UserId ? updatedUserInfo : user
      // })
      setUserInfo([updatedUserInfo])
      toast.success(response.data.message)
    } catch (err) {
      console.log(err);
    }
    setOccupation("")
    setLocation("")
    setLinkdin("")
    setInsta("")
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)} variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Occupation" className="text-right">
                Occupation
              </Label>
              <Input
                id="Occupation"
                placeholder="Occupation"
                className="col-span-3"
                value={Occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Location" className="text-right">
                Location
              </Label>
              <Input
                id="Location"
                placeholder="Location"
                className="col-span-3"
                value={Location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Linkdin" className="text-right">
                Linkdin
              </Label>
              <Input
                id="Linkdin"
                placeholder="Link"
                className="col-span-3"
                value={Linkdin}
                onChange={(e) => setLinkdin(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Instagram" className="text-right">
                Instagram
              </Label>
              <Input
                id="Instagram"
                placeholder="Link"
                className="col-span-3"
                value={Insta}
                onChange={(e) => setInsta(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={EditProfile} type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditProfileDialog