import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const SignupPage = ({ darkMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const obj = { username, email, password };
    console.log(obj);
    const url = "http://localhost:5500/api/signup";
  
    try {
      const res = await axios.post(url, obj);
      if (res.status === 200) {
        sendWelcomeEmail(email);
        alert("User added successfully");
      } else {
        Promise.reject();
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Email already exists in the database");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  // Function to send a welcome email
  const sendWelcomeEmail = async (userEmail) => {
    const welcomeEmailUrl = "http://localhost:5500/api/sendWelcomeEmail"; // Create this endpoint on your server

    try {
      await axios.post(welcomeEmailUrl, { email: userEmail });
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };


  return (
    <div className={`signup-page ${darkMode ? 'dark-mode' : ''}`}>
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
        <button type="submit">Signup</button>
      </form><pre></pre>
      <p>Already have an account? <Link to="/login">Login</Link></p> {/* Link to Login Page */}
    </div>
  );
};

export default SignupPage;
