import React from 'react';
import './Dashboard.css';

export default function PlatformStats({ platform, onClose }) {
  return (
    <div className="stats-overlay">
      <div className="stats-modal">
        <div className="stats-header">
          <h2>{platform} Statistics</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="stats-content">
          {/* Platform specific stats will go here */}
          <div className="stats-item">
            <span>Total Problems Solved</span>
            <span>123</span>
          </div>
          <div className="stats-item">
            <span>Current Rating</span>
            <span>1500</span>
          </div>
          <div className="stats-item">
            <span>Global Rank</span>
            <span>#10000</span>
          </div>
        </div>
      </div>
    </div>
  );
}