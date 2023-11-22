import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation 
import axios from "axios";
import { useAuth } from './AuthContext';
import './Login.css';


const LoginPage = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setLoggedIn,setUserId,setUserBids, setUsername} = useAuth();


  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5500/api/login', {
        email,
        password
      });
  
      console.log('Response:', response);
  
      if (response.data.message === 'Login successful') {
        // Login successful logic
        alert('Login successful!');
        setLoggedIn(true);
        setUserId(email); // Set userId to the user's email
        setUsername(response.data.username); // Set the username from the response
        localStorage.setItem('loggedIn', true); // Set login status to true in local storage
        localStorage.setItem('userId', email); // Set user ID in local storage
        localStorage.setItem('username', response.data.username); // Set username in local storage

        // Fetch user bids on login
      const userBidsResponse = await axios.get(`http://localhost:5500/api/getUserBids/${email}`);
      console.log('User Bids:', userBidsResponse.data.userBids);
      
      // Set user bids in the context state
      setUserBids(userBidsResponse.data.userBids);

        navigate('/bidding');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
  
      // Move the error handling inside the try block
    if (error.response && error.response.status === 401) {
      if (error.response.data.message === 'Email does not exist') {
        alert('Email does not exist.');
      } else if (error.response.data.message === 'Incorrect password') {
        alert('Incorrect password.');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } else {
      alert('An error occurred. Please try again later.');
    }
  }
};

const handleForgotPassword = async () => {
  try {
    const response = await axios.post('http://localhost:5500/api/forgotPassword', { email });

    if (response.data.message === 'Email sent successfully') {
      alert('An email with the new password has been sent to your email address.');
    } else {
      alert('An error occurred. Please try again later.');
    }
  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      if (error.response.status === 404) {
        alert('Email not found.');
      } else if (error.response.status === 500) {
        alert('An error occurred. Please try again later.');
      }
    } else {
      alert('An error occurred. Please try again later.');
    }
  }
};
  
  

  return (
    <div className={`login-page ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
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
