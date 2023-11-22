// Navbar.js

import React from 'react';
import { Link , useNavigate} from 'react-router-dom';
import logoImage from './bidbot.png'; // Replace with the actual path to your logo image
import { useAuth } from './AuthContext';

const MoonSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 384 512">
    <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
  </svg>

  
);
const Navbar = ({ darkMode,toggleDarkMode }) => {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, setUserId } = useAuth();

  const handleLogout = () => {
    // Clear user credentials from local storage
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');

    // Reset context state
    setLoggedIn(false);
    setUserId(null);

    // Redirect to the home page
    navigate('/');

    // Additional logout logic can be added here if needed
  };
  
  return (
    <nav className={`navbar navbar-expand-lg  ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
        <img src={logoImage} alt="Your Logo" className="logo-image" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
          <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product">
                Products
              </Link>
            </li>
            {/* Always display the "Bidding" link */}
            <li className="nav-item">
              <Link className="nav-link" to="/bidding">
                Bidding
              </Link>
            </li>
            {loggedIn ? (
              <>
                {/* Display "Your Bids" link only when the user is logged in */}
                <li className="nav-item">
                  <Link className="nav-link" to="/userBids">
                    Your Bids
                  </Link>
                </li>
                <li className="nav-item">
            <Link className="nav-link" to="/my-profile">
              My Profile
            </Link>
          </li>
                {/* Replace the Logout button with a styled link */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${darkMode ? 'btn-toggle-dark' : ''}`}
                    to="/"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Display "Login" and "Signup" links only when the user is not logged in */}
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/aboutus">
                About
              </Link>
            </li>
            {/* Always display the dark mode toggle button */}
            <li className="nav-item">
              <button
                className="btn btn-sm"
                onClick={toggleDarkMode}
                style={{ backgroundColor: 'transparent', border: 'none' }}
              >
                <MoonSVG />
              </button>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
