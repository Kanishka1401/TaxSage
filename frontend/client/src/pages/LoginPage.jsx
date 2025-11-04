import React, { useState, useContext, useEffect } from 'react';
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

  const [userData, setUserData] = useState({ email: '', password: '' });
  const [caData, setCaData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverReady, setServerReady] = useState(false);

  // Check if server is ready on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      console.log('🔍 Checking server status...');
      const response = await axios.get('http://localhost:5001/health', { timeout: 5000 });
      console.log('✅ Server health check:', response.data);
      setServerReady(true);
    } catch (error) {
      console.error('❌ Server not ready:', error);
      setError('Backend server is starting up. Please wait a moment and try again.');
      // Retry after 3 seconds
      setTimeout(checkServerStatus, 3000);
    }
  };

  // --- Handlers for User Login ---
  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    
    if (!serverReady) {
      setError('Server is still starting up. Please wait...');
      await checkServerStatus();
      return;
    }

    setError('');
    setLoading(true);
    
    if (!userData.email || !userData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      console.log('🔑 Attempting user login with:', userData.email);
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email: userData.email,
        password: userData.password
      }, { timeout: 10000 });

      console.log('✅ User login response:', response.data);

      if (response.data.token) {
        console.log('🎉 Login successful, navigating to dashboard');
        await login(response.data.token, {
          id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          pan: response.data.pan
        }, 'user');
        navigate('/dashboard');
      } else {
        setError('No token received from server');
      }
    } catch (error) {
      console.error('❌ User login error:', error);
      if (error.response) {
        console.error('📡 Server response:', error.response.data);
        setError(error.response.data?.message || `Login failed: ${error.response.status}`);
      } else if (error.request) {
        console.error('🌐 No response received');
        setError('Server is not responding. Please wait a moment and try again.');
        await checkServerStatus();
      } else {
        setError('Login failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for CA Login ---
  const handleCaChange = (e) => {
    setCaData({ ...caData, [e.target.name]: e.target.value });
  };

  const handleCaLogin = async (e) => {
    e.preventDefault();
    
    if (!serverReady) {
      setError('Server is still starting up. Please wait...');
      await checkServerStatus();
      return;
    }

    setError('');
    setLoading(true);
    
    if (!caData.email || !caData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      console.log('🔑 Attempting CA login with:', caData.email);
      
      const response = await axios.post('http://localhost:5001/api/ca/auth/login', caData, {
        timeout: 10000
      });

      console.log('✅ CA login response:', response.data);

      if (response.data.token) {
        console.log('🎉 CA login successful, navigating to CA dashboard');
        await login(response.data.token, {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          icaiNumber: response.data.icaiNumber
        }, 'ca');
        navigate('/ca/dashboard');
      } else {
        setError('No token received from server');
      }
    } catch (error) {
      console.error('❌ CA login error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Server might be restarting.');
        await checkServerStatus();
      } else if (error.response) {
        console.error('📡 Server response data:', error.response.data);
        console.error('📡 Server response status:', error.response.status);
        setError(error.response.data?.message || `Login failed: ${error.response.status}`);
      } else if (error.request) {
        console.error('🌐 No response received');
        setError('Server is not responding. Please wait and try again.');
        await checkServerStatus();
      } else {
        setError('Login failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveForm(tab);
    setError('');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-[#98c1d9] p-8 space-y-6">
        {/* Logo Section */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={logoUrl} alt="TaxSage Logo" className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#293241]">TaxSage</h1>
            <p className="text-[#3d5a80] text-sm">Smart Tax Solutions</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-[#293241] mb-2">Welcome Back</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#e0fbfc] rounded-lg p-1 border border-[#98c1d9]">
          <button 
            onClick={() => handleTabChange('user')} 
            className={`flex-1 p-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeForm === 'user' 
                ? 'bg-[#3d5a80] text-white shadow-sm' 
                : 'bg-transparent text-[#3d5a80] hover:bg-[#98c1d9] hover:text-white'
            }`}
          >
            User Login
          </button>
          <button 
            onClick={() => handleTabChange('ca')} 
            className={`flex-1 p-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeForm === 'ca' 
                ? 'bg-[#3d5a80] text-white shadow-sm' 
                : 'bg-transparent text-[#3d5a80] hover:bg-[#98c1d9] hover:text-white'
            }`}
          >
            CA Login
          </button>
        </div>

        {error && (
          <div className={`rounded-lg p-3 ${
            error.includes('starting') || error.includes('wait') 
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <p className="text-sm text-center">{error}</p>
          </div>
        )}

        {/* User Login Form */}
        <form 
          onSubmit={handleUserLogin} 
          className={`space-y-4 transition-all duration-300 ${activeForm === 'user' ? 'block opacity-100' : 'hidden opacity-0'}`}
        >
          <div className="flex justify-center mb-4">
            <img 
              src={userAvatarUrl} 
              alt="User Avatar" 
              className="w-20 h-20 rounded-full bg-[#e0fbfc] border-4 border-[#98c1d9] p-2 transition-transform duration-300 hover:scale-105" 
            />
          </div>
          
          <div>
            <label htmlFor="user-email" className="text-sm font-medium text-[#3d5a80] mb-1 block">Email</label>
            <input 
              type="email" 
              name="email" 
              id="user-email" 
              required 
              onChange={handleUserChange} 
              value={userData.email} 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="you@example.com" 
              disabled={!serverReady || loading}
            />
          </div>
          
          <div>
            <label htmlFor="user-pass" className="text-sm font-medium text-[#3d5a80] mb-1 block">Password</label>
            <input 
              type="password" 
              name="password" 
              id="user-pass" 
              required
              onChange={handleUserChange} 
              value={userData.password} 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="Enter password" 
              disabled={!serverReady || loading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!serverReady || loading}
            className="w-full bg-[#3d5a80] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2d4566] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-[#3d5a80] flex items-center justify-center"
          >
            {!serverReady ? (
              'Waiting for server...'
            ) : loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
          
          <p className="text-center text-sm text-[#3d5a80] mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#293241] hover:underline hover:text-[#3d5a80] transition-colors">
              Sign up
            </Link>
          </p>
        </form>

        {/* CA Login Form */}
        <form 
          onSubmit={handleCaLogin} 
          className={`space-y-4 transition-all duration-300 ${activeForm === 'ca' ? 'block opacity-100' : 'hidden opacity-0'}`}
        >
          <div className="flex justify-center mb-4">
            <img 
              src={caAvatarUrl} 
              alt="CA Avatar" 
              className="w-20 h-20 rounded-full bg-[#e0fbfc] border-4 border-[#98c1d9] p-2 transition-transform duration-300 hover:scale-105" 
            />
          </div>
          
          <div>
            <label htmlFor="ca-email" className="text-sm font-medium text-[#3d5a80] mb-1 block">CA Email</label>
            <input 
              type="email" 
              name="email" 
              id="ca-email" 
              required 
              onChange={handleCaChange} 
              value={caData.email} 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="ca@example.com" 
              disabled={!serverReady || loading}
            />
          </div>
          
          <div>
            <label htmlFor="ca-pass" className="text-sm font-medium text-[#3d5a80] mb-1 block">Password</label>
            <input 
              type="password" 
              name="password" 
              id="ca-pass" 
              required 
              onChange={handleCaChange} 
              value={caData.password} 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="Enter password" 
              disabled={!serverReady || loading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!serverReady || loading}
            className="w-full bg-[#3d5a80] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2d4566] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-[#3d5a80] flex items-center justify-center"
          >
            {!serverReady ? (
              'Waiting for server...'
            ) : loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : 'Login as CA'}
          </button>

          <p className="text-center text-sm text-[#3d5a80] mt-6">
            Need help?{' '}
            <button type="button" className="font-semibold text-[#293241] hover:underline hover:text-[#3d5a80] transition-colors bg-transparent border-none cursor-pointer">
              Contact Support
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;