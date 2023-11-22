// MyProfile.js

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyProfile.css';

const MyProfile = ({ darkMode, email }) => {
  const { userId  } = useAuth(); // Assuming you have a 'username' property in your AuthContext
  const [totalBids, setTotalBids] = useState(0);
 const [totalProducts, setTotalProducts] = useState(0);
 const [winningBids, setWinningBids] = useState(0);
 const [averageBidAmount, setAverageBidAmount] = useState(0);
 const [winningRate, setWinningRate] = useState(0);

 useEffect(() => {
   const fetchProfileStatistics = async () => {
     try {
       const bidsResponse = await axios.get(`http://localhost:5500/api/getTotalBids/${userId}`);
       setTotalBids(bidsResponse.data.totalBids);

       const productsResponse = await axios.get(`http://localhost:5500/api/getTotalProducts/${userId}`);
       setTotalProducts(productsResponse.data.totalProducts);

       const winningBidsResponse = await axios.get(`http://localhost:5500/api/getWinningBids/${userId}`);
       setWinningBids(winningBidsResponse.data.winningBids);


       const userBidsResponse = await axios.get(`http://localhost:5500/api/getUserBids/${userId}`);
       const userBids = userBidsResponse.data.userBids;
       
       // Calculate average bid amount
       const totalBidAmount = userBids.reduce((sum, bid) => sum + bid.bidAmount, 0);
       const averageBid = totalBids > 0 ? totalBidAmount / totalBids : 0;
       setAverageBidAmount(averageBid);

       // Calculate winning rate
       const rate = totalBids > 0 ? (winningBids / totalBids) * 100 : 0;
       setWinningRate(rate);

     } catch (error) {
       console.error('Error fetching profile statistics:', error);
     }
   };

   fetchProfileStatistics();
 }, [userId,totalBids,winningBids]);

  return (
    <div className={`my-profile-container mt-5 ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`my-profile-card ${darkMode ? 'text-light bg-dark' : ''}`}>
        <div className="card-body">
          <h2 className={`card-title ${darkMode ? 'text-light' : ''}`}>My Profile</h2><pre></pre>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Welcome, User!
          </p>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Your Email : {userId}
          </p><p className={`card-text ${darkMode ? 'text-light' : ''}`}>
           Total Bids Placed: {totalBids}
         </p>
         <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
           Total Products Listed: {totalProducts}
         </p>
         <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
           Winning Bids: {winningBids}
         </p>
         <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
           Average Bid Amount: &#8377;{averageBidAmount.toFixed(2)}
         </p>
         <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
           Winning Rate: {winningRate.toFixed(2)}%
         </p><pre></pre>
          <Link className={`my-profile-btn-primary ${darkMode ? 'btn-toggle-dark' : ''}`} to="/bidding">
            View Your Products
          </Link>&nbsp; &nbsp;
          <Link className={`my-profile-btn-primary ${darkMode ? 'btn-toggle-dark' : ''}`} to="/userBids">
            View Your Placed Bids
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProfile; 