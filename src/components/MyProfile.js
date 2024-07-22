import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './MyProfile.css';

const MyProfile = ({ darkMode }) => {
  const { userId } = useAuth();
  const [totalBids, setTotalBids] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [winningBids, setWinningBids] = useState(null);
  const [averageBidAmount, setAverageBidAmount] = useState(null);
  const [winningRate, setWinningRate] = useState(null);
  const [loading, setLoading] = useState({
    totalBids: true,
    totalProducts: true,
    winningBids: true,
    averageBidAmount: true,
    winningRate: true,
  });

  useEffect(() => {
    const fetchProfileStatistics = async () => {
      try {
        const bidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getTotalBids/${userId}`);
        setTotalBids(bidsResponse.data.totalBids);
        setLoading(prev => ({ ...prev, totalBids: false }));

        const productsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getTotalProducts/${userId}`);
        setTotalProducts(productsResponse.data.totalProducts);
        setLoading(prev => ({ ...prev, totalProducts: false }));

        const winningBidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getWinningBids/${userId}`);
        setWinningBids(winningBidsResponse.data.winningBids);
        setLoading(prev => ({ ...prev, winningBids: false }));

        const userBidsResponse = await axios.get(`https://backend-online-auction-system-mern.onrender.com/api/getUserBids/${userId}`);
        const userBids = userBidsResponse.data.userBids;
        
        // Calculate average bid amount
        const totalBidAmount = userBids.reduce((sum, bid) => sum + bid.bidAmount, 0);
        const averageBid = bidsResponse.data.totalBids > 0 ? totalBidAmount / bidsResponse.data.totalBids : 0;
        setAverageBidAmount(averageBid);
        setLoading(prev => ({ ...prev, averageBidAmount: false }));

        // Calculate winning rate
        const rate = bidsResponse.data.totalBids > 0 ? (winningBidsResponse.data.winningBids / bidsResponse.data.totalBids) * 100 : 0;
        setWinningRate(rate);
        setLoading(prev => ({ ...prev, winningRate: false }));

      } catch (error) {
        console.error('Error fetching profile statistics:', error);
      }
    };

    fetchProfileStatistics();
  }, [userId]);

  return (
    <div className={`my-profile-container mt-5 ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`my-profile-card ${darkMode ? 'text-light bg-dark' : ''}`}>
        <div className="card-body">
          <h2 className={`card-title ${darkMode ? 'text-light' : ''}`}>My Profile</h2>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Welcome, User!
          </p>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Your Email: {userId}
          </p>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Total Bids Placed: {loading.totalBids ? <ClipLoader size={20} color="#123abc" /> : totalBids}
          </p>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Total Products Listed: {loading.totalProducts ? <ClipLoader size={20} color="#123abc" /> : totalProducts}
          </p>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Winning Bids: {loading.winningBids ? <ClipLoader size={20} color="#123abc" /> : winningBids}
          </p>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Average Bid Amount: {loading.averageBidAmount ? <ClipLoader size={20} color="#123abc" /> : `₹${averageBidAmount.toFixed(2)}`}
          </p>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Winning Rate: {loading.winningRate ? <ClipLoader size={20} color="#123abc" /> : `${winningRate.toFixed(2)}%`}
          </p>
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
