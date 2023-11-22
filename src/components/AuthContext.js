// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('loggedIn') === 'true' || false
  );

  const [userId, setUserId] = useState(
    localStorage.getItem('userId') || null
  );

  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  

  const [userBids, setUserBids] = useState([]); // Initialize userBids state

  useEffect(() => {
    // Fetch user data from local storage on mount
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true' || false;
    const storedUserId = localStorage.getItem('userId') || null;
    
    
    setLoggedIn(storedLoggedIn);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    // Update the username state when it changes in local storage
    setUsername(localStorage.getItem('username') || '');
  }, [loggedIn,username]);
  

  useEffect(() => {
    let sessionTimeout;

    if (loggedIn) {
      sessionTimeout = setTimeout(() => {
        setLoggedIn(false);
        setUserId(null);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userId');
      }, 300000); // 5 minutes in milliseconds
    }

    return () => clearTimeout(sessionTimeout);
  }, [loggedIn]);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userId, setUserId, userBids, setUserBids,username,setUsername}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
