import React, { useState } from "react";
import axios from 'axios'
import './Login.css'
import { toast } from "sonner";
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImgDb } from '../Firebase'

function Login() {
  const navigate = useNavigate();
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setRightPanelActive(true); // Show sign-up form
  };

  const handleSignInClick = () => {
    setRightPanelActive(false); // Show sign-in form
  };

  const [FirstName, setFirstName] = useState('')
  const [LastName, setLastName] = useState('')
  const [ProfilePicture, setProfilePicture] = useState('')
  // const [Bio, setBio] = useState('')
  // const [Occupation, setOccupation] = useState('')
  // const [Location, setLocation] = useState('')
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [_, setCookie] = useCookies(["access_Token"]);

  const OnRegister = async (e) => {
    e.preventDefault();
    toast.info("Creating User...")
    const ImgRef = ref(ImgDb, `ProfilePictures/${ProfilePicture.name}`)
    const snapshot = await uploadBytes(ImgRef, ProfilePicture);
    // Step 3: Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);
    // console.log("Image URL:", downloadURL);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          firstName: FirstName,
          lastName: LastName,
          email: Email,
          Password: Password,
          // Bio: Bio,
          PicturePath: downloadURL,
          // Friends: [],
          // OwnPosts: [],
          // Occupation: Occupation,
          // Location: Location
        }
      );
      setFirstName("")
      setLastName("")
      // setProfilePicture("")
      // setOccupation("")
      // setBio("")
      // setLocation("")
      setEmail("")
      setPassword("")
      toast.success(response.data.message)
      setRightPanelActive(false);
    } catch (err) {
      console.log(err);
    }
  }

  const OnLogin = async (e) => {
    e.preventDefault()
    toast.info("Loggin in...")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email: Email,
          Password: Password
        },
        // { withCredentials: true }
      )
      setEmail("")
      setPassword("")
      setCookie("access_Token", response.data.token);
      window.localStorage.setItem("UserId", response.data.UserId)
      toast.success(response.data.message)
      navigate("/home")
    } catch (error) {
      toast.error("Invalid Email Id or Password")
      console.log(error);
    }
  }

  return (
    <div className="LoginPage">
      <div className={`container ${rightPanelActive ? "right-panel-active" : ""}`}>
        {/* Sign-Up Container */}
        <div className="form-container sign-up-container">
          <form onSubmit={OnRegister}>
            <h2 className="Login-Title">Create Account</h2>
            <input type="text" placeholder="First Name" required value={FirstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" required value={LastName} onChange={(e) => setLastName(e.target.value)} />
            {/* <input type="text" placeholder="PicturePath" onChange={(e) => setProfilePicture(e.target.files[0])} /> */}
            <Input onChange={(e) => setProfilePicture(e.target.files[0])} id="picture" type="file" />
            {/* <input type="text" placeholder="Occupation" value={Occupation} onChange={(e) => setOccupation(e.target.value)} />
            <input type="text" placeholder="Bio" value={Bio} onChange={(e) => setBio(e.target.value)} />
            <input type="text" placeholder="Location" value={Location} onChange={(e) => setLocation(e.target.value)} /> */}
            <input type="email" placeholder="Email" required value={Email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={Password} onChange={(e) => setPassword(e.target.value)} />
            <button className="Login-Page-btn" type="submit">Register</button>
            <button style={{ position: "absolute", bottom: "7px", width: "60%" }} type="button" className="ghost" onClick={handleSignInClick}>Go Back</button>
          </form>
        </div>

        {/* Sign-In Container */}
        <div className="form-container sign-in-container">
          <form onSubmit={OnLogin}>
            <h2 className="Register-Title" style={{ paddingBottom: "10%" }}>HangSquare</h2>
            <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <a href="#">Forgot your password?</a>
            <button className="Login-Page-btn" type="submit">Sign In</button>
            <button style={{ position: "absolute", bottom: "30px" }} type="button" className="ghost" onClick={handleSignUpClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;