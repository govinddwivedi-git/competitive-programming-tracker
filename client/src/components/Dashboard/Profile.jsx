import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import bgImage from '../../assets/images/bg-intro-desktop.png';

export default function Profile() {
  const [codechefData, setCodechefData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CodeChef data
        const codechefResponse = await axios.get(`http://localhost:5000/user-codechef-handle/${user.email}`);
        if (codechefResponse.data.handle) {
          const statsResponse = await fetch(`https://codechef-api.vercel.app/handle/${codechefResponse.data.handle}`);
          const data = await statsResponse.json();
          if (data.success) {
            setCodechefData({
              name: data.name,
              stars: data.stars,
              currentRating: data.currentRating,
              highestRating: data.highestRating,
              globalRank: data.globalRank,
              countryRank: data.countryRank,
              countryName: data.countryName,
              profile: data.profile,
              countryFlag: data.countryFlag
            });
          }
        }

        // Fetch Codeforces data
        const codeforcesResponse = await axios.get(`http://localhost:5000/user-codeforces-handle/${user.email}`);
        if (codeforcesResponse.data.handle) {
          const statsResponse = await fetch(`https://codeforces.com/api/user.info?handles=${codeforcesResponse.data.handle}`);
          const data = await statsResponse.json();
          if (data.status === 'OK') {
            const userInfo = data.result[0];
            setCodeforcesData({
              name: userInfo.handle,
              rank: userInfo.rank || 'unranked',
              currentRating: userInfo.rating || 0,
              maxRating: userInfo.maxRating || 0,
              profile: userInfo.titlePhoto,
              countryName: userInfo.country || 'Unknown',
              organization: userInfo.organization || ''
            });
          }
        }

        // Add LeetCode data fetching
        const leetcodeResponse = await axios.get(`http://localhost:5000/user-leetcode-handle/${user.email}`);
        if (leetcodeResponse.data.handle) {
          // Fetch user info, solved problems, and contest info in parallel
          const [userInfo, solvedInfo, contestInfo] = await Promise.all([
            fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeResponse.data.handle}`).then(res => res.json()),
            fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeResponse.data.handle}/solved`).then(res => res.json()),
            fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeResponse.data.handle}/contest`).then(res => res.json())
          ]);

          setLeetcodeData({
            name: leetcodeResponse.data.handle,
            profile: userInfo.avatar,  // Add profile picture URL
            ranking: userInfo.ranking,
            currentRating: contestInfo.contestRating || 0,
            contestsAttended: contestInfo.contestAttend || 0,
            globalRank: contestInfo.contestGlobalRanking || 'N/A',
            solvedQuestions: {
              easy: solvedInfo.easySolved || 0,
              medium: solvedInfo.mediumSolved || 0,
              hard: solvedInfo.hardSolved || 0,
              total: solvedInfo.solvedProblem || 0
            },
            totalQuestions: {
              easy: solvedInfo.totalEasy || 0,
              medium: solvedInfo.totalMedium || 0,
              hard: solvedInfo.totalHard || 0,
              total: solvedInfo.totalQuestions || 0
            },
            acceptanceRate: userInfo.acceptanceRate,
            contributionPoints: userInfo.contributionPoints
          });
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user?.email]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const getCodeforcesRankColor = (rank) => {
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
  };

  return (
    <div className="min-h-screen" style={{ 
      backgroundImage: `url(${bgImage})`,
      backgroundColor: '#f5f5f5' 
    }}>
      <Navbar />
      <div className="profile-container p-8">
        <h1 className="text-5xl font-bold mb-8 text-center mt-8">Profile</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-4xl font-semibold mb-6">User Information</h2>
          <div className="grid grid-cols-2 gap-6 text-lg">
            <p><span className="font-semibold">Name:</span> {user?.first_name} {user?.last_name}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
          </div>
        </div>

        {codechefData && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-3xl font-semibold mb-6">CodeChef Statistics</h2>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={codechefData.profile}
                alt="CodeChef Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{codechefData.name}</h3>
                <a
                  href={`https://www.codechef.com/users/${codechefData.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Profile
                </a>
              </div>
              <div className="ml-auto flex items-center">
                <span className="text-yellow-500 text-2xl">
                  {'★'.repeat(parseInt(codechefData.stars))}
                  {'☆'.repeat(7 - parseInt(codechefData.stars))}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Ratings</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Current Rating: </span>
                    <span className="text-blue-600">{codechefData.currentRating}</span>
                  </p>
                  <p>
                    <span className="font-medium">Highest Rating: </span>
                    <span className="text-green-600">{codechefData.highestRating}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Rankings</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Global Rank: </span>
                    <span className="text-purple-600">#{codechefData.globalRank}</span>
                  </p>
                  <p>
                    <span className="font-medium">Country Rank: </span>
                    <span className="text-purple-600">#{codechefData.countryRank}</span>
                    <span className="ml-2">({codechefData.countryName})</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {codeforcesData && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-3xl font-semibold mb-6">Codeforces Statistics</h2>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={codeforcesData.profile}
                alt="Codeforces Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{codeforcesData.name}</h3>
                <a
                  href={`https://codeforces.com/profile/${codeforcesData.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Profile
                </a>
              </div>
              <div className="ml-auto">
                <span 
                  className="px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: getCodeforcesRankColor(codeforcesData.rank) }}
                >
                  {codeforcesData.rank}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Ratings</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Current Rating: </span>
                    <span className="text-blue-600">{codeforcesData.currentRating}</span>
                  </p>
                  <p>
                    <span className="font-medium">Max Rating: </span>
                    <span className="text-green-600">{codeforcesData.maxRating}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Additional Info</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Country: </span>
                    <span>{codeforcesData.countryName}</span>
                  </p>
                  {codeforcesData.organization && (
                    <p>
                      <span className="font-medium">Organization: </span>
                      <span>{codeforcesData.organization}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {leetcodeData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl font-semibold mb-6">LeetCode Statistics</h2>
            <div className="flex items-center gap-4 mb-4">
              {leetcodeData.profile && (
                <img
                  src={leetcodeData.profile}
                  alt="LeetCode Profile"
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{leetcodeData.name}</h3>
                <a
                  href={`https://leetcode.com/${leetcodeData.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Profile
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Problem Solving</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Easy:</span> <span className="text-green-600">{leetcodeData.solvedQuestions.easy}</span></p>
                  <p><span className="font-medium">Medium:</span> <span className="text-yellow-600">{leetcodeData.solvedQuestions.medium}</span></p>
                  <p><span className="font-medium">Hard:</span> <span className="text-red-600">{leetcodeData.solvedQuestions.hard}</span></p>
                  <p><span className="font-medium">Total:</span> <span className="text-blue-600">{leetcodeData.solvedQuestions.total}</span></p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Contest Info</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Contest Rating:</span> <span className="text-purple-600">{leetcodeData.currentRating.toFixed(2)}</span></p>
                  <p><span className="font-medium">Global Rank:</span> <span>{leetcodeData.globalRank}</span></p>
                  <p><span className="font-medium">Contests Attended:</span> <span>{leetcodeData.contestsAttended}</span></p>
                  <p><span className="font-medium">Acceptance Rate:</span> <span>{leetcodeData.acceptanceRate}%</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
