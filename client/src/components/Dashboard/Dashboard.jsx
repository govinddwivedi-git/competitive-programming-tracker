import React from 'react';
import Navbar from './Navbar';
import './Dashboard.css';
import codechefLogo from '../../assets/coding/codechef.png';
import codeforcesLogo from '../../assets/coding/codeforces.jpg';
import leetcodeLogo from '../../assets/coding/leetcode.jpg';

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
        <div className="platform-cards">
          <div className="platform-card">
            <img src={codechefLogo} alt="CodeChef" className="platform-logo" />
            <h2>CodeChef</h2>
            <p>View your CodeChef statistics and track your progress</p>
            <button className="platform-button">View CodeChef Stats</button>
          </div>
          
          <div className="platform-card">
            <img src={codeforcesLogo} alt="Codeforces" className="platform-logo" />
            <h2>Codeforces</h2>
            <p>Analyze your Codeforces performance and rankings</p>
            <button className="platform-button">View Codeforces Stats</button>
          </div>
          
          <div className="platform-card">
            <img src={leetcodeLogo} alt="LeetCode" className="platform-logo" />
            <h2>LeetCode</h2>
            <p>Check your LeetCode progress and problem-solving stats</p>
            <button className="platform-button">View LeetCode Stats</button>
          </div>
        </div>
        {/* More dashboard content can be added here */}
      </main>
    </div>
  );
}