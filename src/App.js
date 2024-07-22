import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'; // Add this line for general styles
import ReactGA from 'react-ga4';
import HomePage from './components/HomePage';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Navbar from './components/Navbar';
import ProductPage from "./components/ProductPage";
import BiddingPage from './components/BiddingPage';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import UserBidsPage from './components/UserBidsPage';
import MyProfile from './components/MyProfile';

// Component to track pageviews
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return null;
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { email } = useAuth(); // Get the user's email from useAuth
  ReactGA.initialize('G-31EWNSNQEZ', {
  gaOptions: {
    cookieFlags: 'SameSite=None;Secure'
  }
});


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <AuthProvider>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <AnalyticsTracker /> {/* Track pageviews */}
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} />} />
          <Route path="/login" element={<LoginPage darkMode={darkMode} />} />
          <Route path="/signup" element={<SignupPage darkMode={darkMode} />} />
          <Route path="/product" element={<ProductPage darkMode={darkMode} email={email} />} />
          <Route path="/userBids" element={<UserBidsPage darkMode={darkMode} email={email} />} />
          <Route path="/bidding" element={<BiddingPage darkMode={darkMode} />} />
          <Route path="/aboutus" element={<AboutUs darkMode={darkMode} />} />
          <Route path="/my-profile" element={<MyProfile darkMode={darkMode} email={email} />} />
        </Routes>
        <Footer darkMode={darkMode} />
      </AuthProvider>
    </Router>
  );
};

export default App;
