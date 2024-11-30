import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

export default function Profile() {
  const [codechefData, setCodechefData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch CodeChef handle from our backend
        const handleResponse = await axios.get(`http://localhost:5000/user-codechef-handle/${user.email}`);
        const codechefHandle = handleResponse.data.handle;
        
        if (!codechefHandle) {
          console.log('No CodeChef handle found for user');
          setLoading(false);
          return;
        }

        // Then fetch CodeChef stats using the handle
        const statsResponse = await fetch(`https://codechef-api.vercel.app/handle/${codechefHandle}`);
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
  }, []);

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
      <div className="profile-container p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-semibold">Name:</span> {user?.first_name} {user?.last_name}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
          </div>
        </div>

        {codechefData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">CodeChef Statistics</h2>
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

            <div className="grid grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}
