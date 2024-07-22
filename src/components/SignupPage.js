import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';
import { useAuth } from './AuthContext';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader

const SignupPage = ({ darkMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();
  const { setLoggedIn, setUserId, setUsername: setAuthUsername } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    const obj = { username, email, password };
    const signupUrl = "https://backend-online-auction-system-mern.onrender.com/api/signup";
  
    try {
      const signupRes = await axios.post(signupUrl, obj);
      if (signupRes.status === 200) {
        sendWelcomeEmail(email);

        // Automatically log in the user after signup
        const loginRes = await axios.post('https://backend-online-auction-system-mern.onrender.com/api/login', {
          email,
          password
        });

        if (loginRes.status === 200) {
          // Update AuthContext with login details
          const { userId } = loginRes.data; // Assuming the response contains userId
          setLoggedIn(true);
          setUserId(userId);
          setAuthUsername(username);
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('userId', userId);
          localStorage.setItem('username', username);

          toast.success("Signup and login successful");
          setTimeout(() => {
            navigate('/bidding'); // Navigate to the desired page after login
          }, 1500);
          
        } else {
          toast.error("Signup successful, but login failed");
        }
      } else {
        Promise.reject();
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Email already exists in the database");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const sendWelcomeEmail = async (userEmail) => {
    const welcomeEmailUrl = "https://backend-online-auction-system-mern.onrender.com/api/sendWelcomeEmail";

    try {
      await axios.post(welcomeEmailUrl, { email: userEmail });
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  return (
    <div className={`signup-page ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer />
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" disabled={loading}> {/* Disable button while loading */}
          {loading ? <ClipLoader size={20} color="#fff" /> : 'Signup'} {/* Show spinner or Signup text */}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default SignupPage;
