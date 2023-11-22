import React from 'react';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`footer mt-5 py-4 ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <hr className={`mb-4 ${darkMode ? 'dark-hr' : ''}`} />
            <p>&copy; 2023 Made by Group 369. All rights reserved. Thanks for visiting!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

