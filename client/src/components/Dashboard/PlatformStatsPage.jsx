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
      try {
        if (platform === 'codechef') {
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

          // Get valid user details and sort by rating
          const usersDetails = (await Promise.all(userDetailsPromises))
            .filter(Boolean)
            .sort((a, b) => b.currentRating - a.currentRating); // Sort by rating in descending order
          
          setUsersData(usersDetails);
        } 
        else if (platform === 'codeforces') {
          // Get all Codeforces usernames from database
          const response = await axios.get('http://localhost:5000/codeforces-users');
          const users = response.data.users;

          // Fetch details for each username from Codeforces API
          const userDetailsPromises = users.map(async (user) => {
            try {
              const apiResponse = await fetch(`https://codeforces.com/api/user.info?handles=${user.username}`);
              const data = await apiResponse.json();
              if (data.status === 'OK') {
                const userInfo = data.result[0];
                return {
                  name: userInfo.handle,
                  currentRating: userInfo.rating || 0,
                  maxRating: userInfo.maxRating || 0,
                  rank: userInfo.rank || 'unranked',
                  profile: userInfo.titlePhoto,
                  countryName: userInfo.country || 'Unknown',
                  organization: userInfo.organization || '',
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching data for ${user.username}:`, error);
              return null;
            }
          });

          // Get valid user details and sort by rating
          const usersDetails = (await Promise.all(userDetailsPromises))
            .filter(Boolean)
            .sort((a, b) => b.currentRating - a.currentRating);
          
          setUsersData(usersDetails);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [platform]);

  const getRankColor = (rank) => {
    if (platform === 'codeforces') {
      switch (rank) {
        case 'newbie': return '#808080';
        case 'pupil': return '#008000';
        case 'specialist': return '#03A89E';
        case 'expert': return '#0000FF';
        case 'candidate master': return '#AA00AA';
        case 'master': return '#FF8C00';
        case 'international master': return '#FF8C00';
        case 'grandmaster': return '#FF0000';
        case 'international grandmaster': return '#FF0000';
        case 'legendary grandmaster': return '#FF0000';
        default: return '#808080';
      }
    }
    // Convert stars to number to ensure proper comparison
    const starCount = parseInt(rank, 10);
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
        <h1 className="platform-title text-3xl">
          {platform === 'codechef' ? 'CodeChef' : 'Codeforces'} Users Statistics
        </h1>
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
                  src={platform === 'codechef' ? user.profile : user.profile}
                  alt={`${user.name}'s profile`} 
                  className="user-avatar"
                />
                <span 
                  className="rank-tag"
                  style={{ 
                    backgroundColor: platform === 'codechef' ? 
                      getRankColor(user.stars) : 
                      getRankColor(user.rank),
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {platform === 'codechef' ? user.stars : user.rank}
                </span>
              </div>
              <h2>{user.name}</h2>
              <div className="user-stats">
                <p>Current Rating: {user.currentRating}</p>
                <p>Highest Rating: {platform === 'codechef' ? user.highestRating : user.maxRating}</p>
                {platform === 'codechef' ? (
                  <>
                    <div className="country-info">
                      <img src={user.countryFlag} alt={user.countryName} className="country-flag" />
                      <span>{user.countryName}</span>
                    </div>
                    <p>Global Rank: {user.globalRank}</p>
                    <p>Country Rank: {user.countryRank}</p>
                    <p>Stars: {user.stars}</p>
                  </>
                ) : (
                  <>
                    <p>Country: {user.countryName}</p>
                    {user.organization && <p>Organization: {user.organization}</p>}
                    <p>Rank: {user.rank}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}