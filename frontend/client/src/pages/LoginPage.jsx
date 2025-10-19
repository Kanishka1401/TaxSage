import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';

const logoUrl = require('../assets/logo.png');
const userAvatarUrl = require('../assets/user-avatar.png');
const caAvatarUrl = require('../assets/ca-avatar.png');

const LoginPage = () => {
  const [activeForm, setActiveForm] = useState('user');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // State for form data
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [caData, setCaData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isEmailOnly, setIsEmailOnly] = useState(false);

  // --- Handlers for User Login ---
  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!userData.email) {
      setError('Email is required');
      return;
    }

    try {
      let response;
      
      if (isEmailOnly) {
        // Email-only login (magic link style)
        response = await axios.post('http://localhost:5001/api/auth/email-login', {
          email: userData.email
        });
        
        if (response.data.success) {
          setError('Check your email for login instructions!');
          return;
        }
      } else {
        // Regular email + password login
        if (!userData.password) {
          setError('Password is required');
          return;
        }
        
        response = await axios.post('http://localhost:5001/api/auth/login', userData);
        
        if (response.data.token) {
          login(response.data.token, {
            id: response.data._id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            pan: response.data.pan
          });
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  // --- Handlers for CA Login ---
  const handleCaChange = (e) => {
    setCaData({ ...caData, [e.target.name]: e.target.value });
  };

  const handleCaLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/ca/auth/login', caData);
      if (response.data.token) {
        // Store CA token and data
        localStorage.setItem('ca_token', response.data.token);
        localStorage.setItem('ca_user', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          icaiNumber: response.data.icaiNumber
        }));
        navigate('/dashboard'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#FFF7DD] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex justify-center">
          <img src={logoUrl} alt="TaxSage Logo" className="w-24" />
        </div>
        <div className="text-center">
  <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-2">Welcome Back</h2>
  <p className="text-sm text-gray-500 font-light">Sign in to your account</p>
</div>
        <div className="flex bg-[#91C4C3] rounded-lg p-1">
          <button onClick={() => setActiveForm('user')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-all duration-300 ${activeForm === 'user' ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-white'}`}>
            User Login
          </button>
          <button onClick={() => setActiveForm('ca')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-all duration-300 ${activeForm === 'ca' ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-white'}`}>
            CA Login
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* User Login Form */}
        <form onSubmit={handleUserLogin} className={`space-y-4 ${activeForm === 'user' ? 'block' : 'hidden'}`}>
          <div className="flex justify-center mb-4">
            <img src={userAvatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full bg-gray-200 p-2 transition-transform duration-300 hover:scale-110" />
          </div>
          
          <div>
            <label htmlFor="user-email" className="text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              id="user-email" 
              required 
              onChange={handleUserChange} 
              value={userData.email} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" 
              placeholder="you@example.com" 
            />
          </div>
          
          {!isEmailOnly && (
            <div>
              <label htmlFor="user-pass" className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                name="password" 
                id="user-pass" 
                required={!isEmailOnly}
                onChange={handleUserChange} 
                value={userData.password} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" 
                placeholder="Enter password" 
              />
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-only"
              checked={isEmailOnly}
              onChange={(e) => setIsEmailOnly(e.target.checked)}
              className="h-4 w-4 text-[#80A1BA] focus:ring-[#80A1BA] border-gray-300 rounded"
            />
            <label htmlFor="email-only" className="ml-2 block text-sm text-gray-700">
              Login with email only (magic link)
            </label>
          </div>
          
          <button type="submit" className="w-full bg-[#80A1BA] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6d8da4] transition-colors duration-300">
            {isEmailOnly ? 'Send Magic Link' : 'Login'}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-gray-800 hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        {/* CA Login Form */}
        <form onSubmit={handleCaLogin} className={`space-y-4 ${activeForm === 'ca' ? 'block' : 'hidden'}`}>
          <div className="flex justify-center mb-4">
            <img src={caAvatarUrl} alt="CA Avatar" className="w-16 h-16 rounded-full bg-gray-200 p-2 transition-transform duration-300 hover:scale-110" />
          </div>
          <div>
            <label htmlFor="ca-email" className="text-sm font-medium text-gray-700">CA Email</label>
            <input 
              type="email" 
              name="email" 
              id="ca-email" 
              required 
              onChange={handleCaChange} 
              value={caData.email} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" 
              placeholder="ca@example.com" 
            />
          </div>
          <div>
            <label htmlFor="ca-pass" className="text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="password" 
              id="ca-pass" 
              required 
              onChange={handleCaChange} 
              value={caData.password} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" 
              placeholder="Enter password" 
            />
          </div>
          <button type="submit" className="w-full bg-[#80A1BA] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6d8da4] transition-colors duration-300">
            Login as CA
          </button>
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help?{' '}
            <button type="button" className="font-semibold text-gray-800 hover:underline bg-transparent border-none cursor-pointer">
              Contact Support
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;