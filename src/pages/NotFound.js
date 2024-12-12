import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        fontFamily: "'Arial', sans-serif",
        color: '#333',
      }}
    >
      {/* <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
        Oops! The page you're looking for doesn't exist.
      </p> */}
      <img
        src="https://storage.googleapis.com/argon-magnet-442917-k1.appspot.com/public/404-error.jpg"
        alt="Not Found"
        style={{
          maxWidth: '100%',
          height: 'auto',
          backgroundColor: "#f4f3fb",
          marginTop: '5rem',
          display: 'block',
          margin: '0 auto 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      />
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
