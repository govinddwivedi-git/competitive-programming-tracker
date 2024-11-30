import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import bgImage from '../../assets/images/bg-intro-desktop.png';

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
        else if (platform === 'leetcode') {
          console.log('Fetching LeetCode users...'); // Add logging
          const response = await axios.get('http://localhost:5000/leetcode-users');
          console.log('LeetCode users response:', response.data); // Add logging
          const users = response.data.users;

          // Fetch details for each username from LeetCode API
          const userDetailsPromises = users.map(async (user) => {
            try {
              const [userInfo, solvedInfo, contestInfo] = await Promise.all([
                fetch(`https://alfa-leetcode-api.onrender.com/${user.username}`).then(res => res.json()),
                fetch(`https://alfa-leetcode-api.onrender.com/${user.username}/solved`).then(res => res.json()),
                fetch(`https://alfa-leetcode-api.onrender.com/${user.username}/contest`).then(res => res.json())
              ]);

              return {
                name: user.username,
                currentRating: contestInfo.contestRating || 0,
                globalRank: contestInfo.contestGlobalRanking || 'N/A',
                totalParticipants: contestInfo.totalParticipants || 'N/A',
                contestsAttended: contestInfo.contestAttend || 0,
                solvedQuestions: {
                  easy: solvedInfo.easySolved || 0,
                  medium: solvedInfo.mediumSolved || 0,
                  hard: solvedInfo.hardSolved || 0,
                  total: solvedInfo.solvedProblem || 0
                },
                profile: userInfo.avatar || 'default-avatar-url'
              };
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
        console.error('Error details:', {  // Enhanced error logging
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
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
    <div className="min-h-screen" style={{ 
      backgroundImage: `url(${bgImage})`,
      backgroundColor: '#f5f5f5' 
    }}>
      <Navbar />
      <div className="platform-stats-container p-8">
        <h1 className="platform-title text-4xl font-bold mb-8">
          {platform === 'codechef' ? 'CodeChef' : platform === 'codeforces' ? 'Codeforces' : 'LeetCode'} Users Statistics
        </h1>
        <div className="users-grid">
          {usersData.map((user, index) => (
            <div key={index} className="user-card p-6">
              {/* Rank display */}
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

              {/* User card header */}
              <div className="user-card-header">
                <img 
                  src={user.profile}
                  alt={`${user.name}'s profile`} 
                  className="user-avatar"
                />
                {platform === 'leetcode' ? (
                  <div className="leetcode-stats">
                    <p className="rating">Rating: {user.currentRating.toFixed(2)}</p>
                    <p className="rank">Global Rank: {user.globalRank}</p>
                  </div>
                ) : (
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
                )}
              </div>

              <h2 className="text-2xl font-semibold my-4">{user.name}</h2>

              {/* Platform specific stats */}
              <div className="user-stats text-lg">
                {platform === 'leetcode' ? (
                  <div className="solved-stats">
                    <h3 className="text-xl font-semibold mb-3">Solved Problems</h3>
                    <div className="problem-stats">
                      <span className="easy">Easy: {user.solvedQuestions.easy}</span><br />
                      <span className="medium">Medium: {user.solvedQuestions.medium}</span><br />
                      <span className="hard">Hard: {user.solvedQuestions.hard}</span>
                      <p className="total">Total: {user.solvedQuestions.total}</p>
                    </div>
                    <p>Contests Participated: {user.contestsAttended}</p>
                    <p>Contest Rating : {user.currentRating}</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-2">Current Rating: {user.currentRating}</p>
                    <p className="mb-2">Highest Rating: {platform === 'codechef' ? user.highestRating : user.maxRating}</p>
                    
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