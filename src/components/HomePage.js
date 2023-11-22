import React from 'react';
import './homepage.css'
import { Link } from 'react-router-dom';


const HomePage = ({ darkMode }) => {
  return (
    <div className={`homepage-container ${darkMode ? 'dark-mode' : ''}`}>

      <div className='main'>
        <div className='row'>
          <div className='col-md-6'>
            <h1 className="display-4">Welcome to BidBot</h1>
            <p className="lead">
              Explore a seamless online auction experience with BidBot. List your items
              with detailed descriptions and starting bids. Bid on exciting items and
              enjoy features like automated bidding and auction ending times.
            </p>
          </div>
          <div className='col-md-6'>
            <img src="https://blog.admixer.com/wp-content/uploads/2020/03/hidder-bid-cover.jpg" height="400vh" width="600vh"></img>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className='key-feat'>
        <h1 className="display-4">Key Features</h1>
        <div className='row'>
          <div className='col-md-6'>
            <ul>
              <li>Add products with detailed descriptions, starting bids, and bid ending times.</li>
              <li>Delete and modify bids with real-time updates to the connected MongoDB database.</li>
              <li>Experience automated bidding where the highest bidder wins after the auction ends.</li>
              <li>Enjoy a secure authentication system ensuring only logged-in users can participate.</li>
              <li>Utilize the "Forgot Password" feature for a hassle-free password recovery process, receiving a new password directly to your email.</li>
              <li>Automatic logout after 5 minutes of inactivity for enhanced security.</li>
            </ul>
            <Link to="/bidding" className="btn btn-primary add-bids-button">
              Add Bids
            </Link>
          </div>
          <div className='col-md-6'>
            <ul>
            <li>Receive email notifications for successful bid placements and congratulatory messages when you are currently winning a bid.</li>
            <li>Explore transparency with a detailed "Your Bids" section, showcasing your bid history, product details, and current bid status.</li>
            <li>Efficiently search for products by name or bid amount on the Products and Your Bids pages.</li>
            <li>Filter Your Bids page to view all bids or only winning bids for better organization.</li>
            <li>Check your bidding statistics on the My Profile page, including total bids placed, number of bids won, win rate, average bid amount, etc.</li>
            </ul>&nbsp;&nbsp;&nbsp;
            <Link to="/product" className="btn btn-primary">
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
};

export default HomePage;
