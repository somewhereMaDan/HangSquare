import { UserModel } from "../models/Users.js"


export const GetUserInfo = async (req, res) => {
  const id = req.params.id;

  const user = await UserModel.findById(id)

  if (!user) {
    return res.status(403).json({ error: "User not found" })
  }
  return res.status(200).json({ message: "Got User Info", UserInfo: user, Location: user.Location, Occupation: user.Occupation, SocialProfile: user.SocialProfile })
}

export const GetUserFriends = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id)

    const FriendsId = user.Friends

    const FriendsArr = [];

    for (const friendId of FriendsId) {
      const UserFriend = await UserModel.findById(friendId)
      FriendsArr.push(UserFriend)
    }
    return res.status(200).json({ FriendsArr: FriendsArr, FriendsId: FriendsId })
  } catch (err) {
    res.status(404).json({ err })
  }
}

export const addRemoveFriend = async (req, res) => {
  try {
    const { UserId, friendId } = req.params;

    const user = await UserModel.findById(UserId);
    const FriendUser = await UserModel.findById(friendId);

    if (user.Friends.includes(friendId)) {
      const removeFriendFromUser = user.Friends.filter((id) => id !== friendId)
      const removeUserFromFriend = FriendUser.Friends.filter((id) => id !== UserId)
      user.Friends = removeFriendFromUser
      FriendUser.Friends = removeUserFromFriend
    } else {
      user.Friends.push(friendId)
      FriendUser.Friends.push(UserId)
    }
    await user.save();
    await FriendUser.save()

    return res.status(200).json({ message: "Friend List Updated", SingleUser: user })
  } catch (err) {
    return res.status(404).json({ error: err.message })
  }
}

export const CompleteProfile = async (req, res) => {
  try {
    const { UserId } = req.params;
    const { Firstname, Lastname, Location, Occupation, Instagram, Linkdin } = req.body

    const user = await UserModel.findById(UserId);

    if (!user) {
      return res.status(403).json({ error: "User not found" })
    }

    if (Instagram.trim() === '' && Linkdin.trim() !== '') {
      user.SocialProfile.set("Linkdin", Linkdin)
    } else if (Linkdin.trim() === '' && Instagram.trim() !== '') {
      user.SocialProfile.set("Instagram", Instagram)
    } else if (Linkdin.trim() !== '' && Instagram.trim() !== '') {
      user.SocialProfile.set("Instagram", Instagram)
      user.SocialProfile.set("Linkdin", Linkdin)
    }
    user.firstName = (Firstname || "") || user.firstName
    user.lastName = Lastname || user.lastName

    user.Location = (Location || "") || user.Location
    user.Occupation = (Occupation || "") || user.Occupation

    await user.save()

    return res.status(200).json({
      message: "Profile updated successfully", Occupation: user.Occupation, Location: user.Location,
      Linkdin: user.SocialProfile.get("Linkdin"), Instagram: user.SocialProfile.get("Instagram"),
      user : user
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}