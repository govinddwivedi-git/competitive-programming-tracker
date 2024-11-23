import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import bgImage from "../assets/images/bg-intro-desktop.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      
      if (response.data.user) {
        // Store user data in localStorage or state management system
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard'); // or wherever you want to redirect after login
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-main">
      <div  className="login-left flex justify-center items-center h-screen p-5 bg-blue-500 bg-cover bg-center text-center text-white" style={{ backgroundImage: `url(${bgImage})` }}>
        <img src={Image} alt="" />
      </div>
      <div className="login-right bg-slate-400" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <div className="login-center-options " >
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="submit">Log In</button>
                <button type="submit">
                  <img src={GoogleSvg} alt="" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
