import React from 'react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <img 
        src="https://storage.googleapis.com/argon-magnet-442917-k1.appspot.com/public/404-error.jpg" 
        alt="Not Found" 
        style={{
          maxWidth: '100%',
          height: 'auto',
          marginTop: '1rem',
          display: 'block',
          margin: '0 auto'
        }}
      />
    </div>
  );
};

export default NotFound;
