import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to BrainyMath</h1>
      <div className="cta-buttons">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/courses" className="btn btn-secondary">Browse Courses</Link>
      </div>
    </div>
  );
};

export default Home; 