import React from 'react';

const AboutUs = ({ darkMode }) => {
  
  const email = 'mailto:hriday.career@gmail.com'; // Replace with your actual email address

  return (
    <div className={`container mt-5 ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`card ${darkMode ? 'text-light bg-dark' : ''}`}>
        <div className="card-body">
          <h2 className={`card-title ${darkMode ? 'text-light' : ''}`}>About Us</h2>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Welcome to BidBot, an innovative online auction platform designed to deliver a seamless auction experience. BidBot aims to provide a user-friendly interface for listing items, placing bids, and managing auctions with ease.
          </p>

          <h4 className={`card-subtitle mb-3 ${darkMode ? 'text-light' : ''}`}>Our Vision</h4>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            Our vision for BidBot is to create a platform where auctions are not just transactions but a community experience. We focus on delivering a secure, transparent, and engaging platform where users can participate in auctions with confidence.
          </p>

          <h4 className={`card-subtitle mb-3 ${darkMode ? 'text-light' : ''}`}>Key Features:</h4>
          <ul className={`list-group ${darkMode ? 'list-group-flush' : ''}`}>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Add products with detailed descriptions, starting bids, and auction ending times.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Real-time updates and modifications to bids connected to a secure MongoDB database.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Automated bidding system where the highest bidder wins after the auction ends.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Secure authentication ensuring only logged-in users can participate.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>"Forgot Password" feature for hassle-free password recovery.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Automatic logout after 5 minutes of inactivity for enhanced security.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Email notifications for successful bid placements and status updates.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Comprehensive "Your Bids" section to view bid history and current status.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Search and filter options to easily navigate bids and products.</li>
            <li className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>Profile statistics including total bids placed, bids won, win rate, and more.</li>
          </ul>

          <h4 className={`mt-3 ${darkMode ? 'text-light' : ''}`}>Tech Stack:</h4>
          <div className="card" style={{ background: darkMode ? '#343a40' : '' }}>
            <div className="card-body">
              <p className={`card-text ${darkMode ? 'text-light' : 'text-dark'}`}>
                <strong>Frontend:</strong> HTML, CSS, Bootstrap, JavaScript, React.js <br />
                <strong>Backend:</strong> Node.js, Express.js <br />
                <strong>Database:</strong> MongoDB
              </p>
            </div>
          </div>
          
          <h4 className={`mt-3 ${darkMode ? 'text-light' : ''}`}>About the Developer</h4>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            This project is developed by Hriday Sehgal, as part of a MERN Stack internship. Hriday is a MERN Stack Developer with a passion for product management and technology. He is dedicated to creating innovative solutions and enhancing user experiences through thoughtful design and robust development.
          </p>

          <h4 className={`mt-3 ${darkMode ? 'text-light' : ''}`}>Contact</h4>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            For any inquiries or further information, feel free to contact Hriday Sehgal at <a href={email} className={darkMode ? 'text-light' : 'text-dark'}>hriday.career@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
