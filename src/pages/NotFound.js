import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../styles/NotFound.css"; // Import the external CSS file

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Your Portfolio</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </Helmet>

      <div className="not-found-container">
        <img
          src="https://storage.googleapis.com/argon-magnet-442917-k1.appspot.com/public/404-error.jpg"
          alt="404 Not Found"
          className="not-found-image"
        />
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="home-link" aria-label="Go back to the home page">
          Go Back to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
