import React from 'react';
import Navbar from './Navbar';
import './Dashboard.css';

export default function Dashboard() {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="welcome-section">
          <h1 className="welcome-heading">Welcome, {user?.first_name || 'User'}!</h1>
          <p className="welcome-text">
            Track your progress across different coding platforms and improve your skills.
          </p>
        </div>
        {/* More dashboard content can be added here */}
      </main>
    </div>
  );
}