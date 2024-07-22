import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation 
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader

const LoginPage = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();
  const { setLoggedIn, setUserId, setUserBids, setUsername } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const response = await axios.post('https://backend-online-auction-system-mern.onrender.com/api/login', {
        email,
        password
      });

      console.log('Response:', response);

      if (response.data.message === 'Login successful') {
        // Login successful logic
        toast.success('Login successful!');
        setLoggedIn(true);
        setUserId(email); // Set userId to the user's email
        setUsername(response.data.username); // Set the username from the response
        localStorage.setItem('loggedIn', true); // Set login status to true in local storage
        localStorage.setItem('userId', email); // Set user ID in local storage
        localStorage.setItem('username', response.data.username); // Set username in local storage

        // Fetch user bids on login
        const userBidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getUserBids/${email}`);
        console.log('User Bids:', userBidsResponse.data.userBids);
        
        // Set user bids in the context state
        setUserBids(userBidsResponse.data.userBids);

        // Delay navigation to allow toast notification to be displayed
        setTimeout(() => {
          navigate('/bidding');
        }, 1500); // Adjust the delay as needed (1000ms = 1 second)
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);

      // Move the error handling inside the try block
      if (error.response && error.response.status === 401) {
        if (error.response.data.message === 'Email does not exist') {
          toast.error('Email does not exist.');
        } else if (error.response.data.message === 'Incorrect password') {
          toast.error('Incorrect password.');
        } else {
          toast.error('Invalid credentials. Please try again.');
        }
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('https://backend-online-auction-system-mern.onrender.com/api/forgotPassword', { email });

      if (response.data.message === 'Email sent successfully') {
        toast.success('An email with the new password has been sent to your email address.');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Email not found.');
        } else if (error.response.status === 500) {
          toast.error('An error occurred. Please try again later.');
        }
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  const handleTestCredentials = (e) => {
    e.preventDefault(); // Prevent the default button behavior
    setEmail('test@example.com');
    setPassword('test123');
  };

  return (
    <div className={`login-page ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer />
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={loading}> {/* Disable button while loading */}
            {loading ? <ClipLoader size={20} color="#fff" /> : 'Login'} {/* Show spinner or Login text */}
          </button>
          <button onClick={handleTestCredentials} className="test-credentials-btn">Test Credentials</button>
        </div>
      </form>
      <p>New user? <Link to="/signup">Signup</Link></p>
      <p>  
        <span className={`forgot-password ${darkMode ? 'dark-mode' : ''}`} onClick={handleForgotPassword}>
          Forgot Password?
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
