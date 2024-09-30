
import { useState, React } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { RiArrowRightUpLine, RiCloseLargeLine, RiMenuLine } from 'react-icons/ri';

export const Navbar = () => {
  const [cookies, setCokkies] = useCookies(["access_Token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCokkies("access_Token", "");
    window.localStorage.removeItem("userID");
    navigate("/");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      {cookies.access_Token && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "1%", paddingRight: "1%", backgroundColor: "white" }}>
          <Link to="/home" className="nav__link" onClick={closeMenu}>
            <span style={{ fontSize: "24px", paddingBottom: "0.5vh" }}>HangSqaure</span>
          </Link>
          <Link to="/" className="nav__link" onClick={closeMenu}>
            <button className='button-52'>
              <span style={{ fontSize: "18px" }}>Logout</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
