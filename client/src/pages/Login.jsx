import React, { useState } from "react";
import axios from 'axios'
import './Login.css'
import { toast } from "sonner";
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImgDb } from '../Firebase'
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
import showPasswordImg from '../assets/showPassword.png'

function Login() {
  const navigate = useNavigate();
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSignUpClick = () => {
    setRightPanelActive(true); // Show sign-up form
  };

  const handleSignInClick = () => {
    setRightPanelActive(false); // Show sign-in form
  };

  const [FirstName, setFirstName] = useState('')
  const [LastName, setLastName] = useState('')
  const [ProfilePicture, setProfilePicture] = useState('')
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [_, setCookie] = useCookies(["access_Token"]);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(prevState => !prevState);
  };

  const OnRegister = async (e) => {
    e.preventDefault();
    const isPasswordValid = passwordRegex.test(Password); // Direct validation
    if (isPasswordValid === false) {
      toast.error("Password must be at least 8 characters long and include a combination of uppercase and lowercase letters, numbers, and symbols.");
      return
    }
    toast.info("Creating User, Please wait...")
    setLoading(true)
    const ImgRef = ref(ImgDb, `ProfilePictures/${ProfilePicture.name}`)
    const snapshot = await uploadBytes(ImgRef, ProfilePicture);
    // Step 3: Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          firstName: FirstName,
          lastName: LastName,
          email: Email,
          Password: Password,
          PicturePath: downloadURL,
        }
      );
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      toast.success(response.data.message)
      setRightPanelActive(false);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  }

  const OnLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    toast.info("Logging in, Please wait...")
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
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error("Invalid Email Id or Password")
      console.log(error);
    }
  }

  const wip = () => {
    alert("Work in Progress...")
  }

  return (
    <div className="LoginPage">
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <div style={{ marginTop: '2vh' }}>
            <b style={{ color: 'cyan' }}>WAITING FOR SERVER ...</b>
          </div>
        </div>
      )}
      <div className={`container ${rightPanelActive ? "right-panel-active" : ""}`}>
        {/* Sign-Up Container */}
        <div className="form-container sign-up-container">
          <form onSubmit={OnRegister}>
            <h2 className="Login-Title">Create Account</h2>
            <input type="text" placeholder="First Name" value={FirstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" value={LastName} onChange={(e) => setLastName(e.target.value)} required />
            <Input onChange={(e) => setProfilePicture(e.target.files[0])} id="picture" type="file" required />
            <input type="email" placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} required />

            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={Password} onChange={(e) => setPassword(e.target.value)} required />
            <button onClick={togglePasswordVisibility}>
            {showPassword ? <img src={showPasswordImg} /> : <img src={showPasswordImg} />}
            </button>

            <button className="Login-Page-btn" type="submit" disabled={loading}>{loading ? "Registering User..." : "Register"}</button>
            <button style={{ position: "absolute", bottom: "7px", width: "60%" }} type="button" className="ghost" onClick={handleSignInClick}>Go Back</button>
          </form>
        </div>

        {/* Sign-In Container */}
        <div className="form-container sign-in-container">
          <form onSubmit={OnLogin}>
            <h2 className="Register-Title" style={{ paddingBottom: "10%" }}>HangSquare</h2>
            <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />

            <input type={showPassword ? 'text' : 'password'} value={Password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button onClick={togglePasswordVisibility}>
              {showPassword ? <img src={showPasswordImg} /> : <img src={showPasswordImg} />}
            </button>

            <ForgotPasswordDialog />
            <button className="Login-Page-btn" type="submit" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
            <button style={{ position: "absolute", bottom: "30px" }} type="button" className="ghost" onClick={handleSignUpClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;