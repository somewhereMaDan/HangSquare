
import { useState, React, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { RiArrowRightUpLine, RiCloseLargeLine, RiMenuLine } from 'react-icons/ri';
import { TempContext } from '../Contexts/TempContext'
import { userGetId } from '@/hooks/userGetId';

export const Navbar = () => {
  const { redirectUserId, setRedirectUserId } = useContext(TempContext)
  const [cookies, setCokkies] = useCookies(["access_Token"]);
  const navigate = useNavigate();
  const LoggedUserId = userGetId()

  const logout = () => {
    setCokkies("access_Token", "");
    window.localStorage.removeItem("UserId");
    navigate("/");
  };

  const closeMenu = () => {
    setRedirectUserId(null)
  };

  const ToRedirectProfile = async () => {
    if (LoggedUserId) {
      setRedirectUserId(LoggedUserId);
    } else {
      console.error('LoggedUserId is not available.');
    }
  };

  useEffect(() => {
    if (redirectUserId) {
      // Navigate to the profile page when redirectUserId is set
      // navigate('/redirectProfile');
      navigate(`/redirectProfile?redirectId=${redirectUserId}`);
    }
  }, [redirectUserId]); // Trigger when redirectUserId is updated




  return (
    <div>
      {cookies.access_Token && (
        <div className='navbar-main'>
          <Link to="/home" className="nav__link" onClick={closeMenu}>
            <span style={{ fontSize: "24px", paddingBottom: "0.5vh" }}>HangSqaure</span>
          </Link>
          <div className="nav__link" >
            <button onClick={ToRedirectProfile} className='responsive-btn'>
              <span className='profile-nav'>Profile</span>
            </button>
          </div>
          <Link to="/ChatSection" className="nav__link" onClick={closeMenu}>
            <button className='responsive-btn'>
              <span className='profile-nav'>Messages</span>
            </button>
          </Link>
          <Link to="/" className="nav__link" onClick={closeMenu}>
            <button onClick={logout} className='logout-btn'>
              <span className='logout-nav'>Logout</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
