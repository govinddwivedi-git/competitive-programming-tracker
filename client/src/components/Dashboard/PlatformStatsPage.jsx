import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

export default function PlatformStatsPage() {
  const { platform } = useParams();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (platform === 'codechef') {
        try {
          // First get all CodeChef usernames from our database
          const response = await axios.get('http://localhost:5000/codechef-users');
          const users = response.data.users;

          // Then fetch details for each username from CodeChef API
          const userDetailsPromises = users.map(async (user) => {
            try {
              const apiResponse = await fetch(`https://codechef-api.vercel.app/handle/${user.username}`);
              const data = await apiResponse.json();
              return data.success ? data : null;
            } catch (error) {
              console.error(`Error fetching data for ${user.username}:`, error);
              return null;
            }
          });

          const usersDetails = (await Promise.all(userDetailsPromises)).filter(Boolean);
          setUsersData(usersDetails);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [platform]);

  const getRankColor = (stars) => {
    // Convert stars to number to ensure proper comparison
    const starCount = parseInt(stars, 10);
    switch (starCount) {
      case 1: return '#808080';  // Gray
      case 2: return '#008000';  // Green
      case 3: return '#0000FF';  // Blue
      case 4: return '#800080';  // Purple
      case 5: return '#FFBF00';  // Golden Yellow
      case 6: return '#FFA500';  // Orange
      case 7: return '#FF0000';  // Red
      default: return '#808080'; // Default gray
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="platform-stats-container">
        <h1 className="platform-title text-3xl">CodeChef Users Statistics</h1>
        <div className="users-grid">
          {usersData.map((user, index) => (
            <div key={index} className="user-card">
              <div className="rank-display" style={{ 
                position: 'absolute', 
                top: '-10px', 
                left: '-10px', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                borderRadius: '50%', 
                width: '30px', 
                height: '30px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold',
                border: '2px solid white'
              }}>
                #{index + 1}
              </div>
              <div className="user-card-header">
                <img 
                  src={user.profile} 
                  alt={`${user.name}'s profile`} 
                  className="user-avatar"
                />
                <span 
                  className="rank-tag"
                  style={{ 
                    backgroundColor: getRankColor(user.stars),
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {user.stars}
                </span>
              </div>
              <h2>{user.name}</h2>
              <div className="user-stats">
                <p>Current Rating: {user.currentRating}</p>
                <p>Highest Rating: {user.highestRating}</p>
                <div className="country-info">
                  <img 
                    src={user.countryFlag} 
                    alt={user.countryName} 
                    className="country-flag"
                  />
                  <span>{user.countryName}</span>
                </div>
                <p>Global Rank: {user.globalRank}</p>
                <p>Country Rank: {user.countryRank}</p>
                <p>Stars: {user.stars}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}