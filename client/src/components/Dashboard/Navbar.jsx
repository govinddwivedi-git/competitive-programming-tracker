import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import Logo from '../../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="dashboard-nav">
      <div className="nav-logo">
        <img src={Logo} alt="Logo" className="nav-logo-img" />
      </div>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/analysis" className="nav-link">View Analysis</Link> 
        <Link to="/profile" className="nav-link">Profile</Link>
      </div>
      <div className="nav-user">
        <span className="user-name">
          {user?.first_name} {user?.last_name}
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}