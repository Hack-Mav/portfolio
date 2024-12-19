import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css'; // Import the external CSS file

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img
        src="https://storage.googleapis.com/argon-magnet-442917-k1.appspot.com/public/404-error.jpg"
        alt="Not Found"
        className="not-found-image"
      />
      <Link to="/" className="home-link">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
