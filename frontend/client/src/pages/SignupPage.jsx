import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const logoUrl = require('../assets/logo.png');

const SignupPage = () => {
  const [activeForm, setActiveForm] = useState('user');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // State for user form data
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    pan: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State for CA form data
  const [caData, setCaData] = useState({
    name: '',
    icaiNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');

  // --- Handlers for User Form ---
  const handleUserChange = (e) => {
    const value = e.target.name === 'pan' ? e.target.value.toUpperCase() : e.target.value;
    setUserData({ ...userData, [e.target.name]: value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        pan: userData.pan,
        password: userData.password,
      });
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
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  // --- Handlers for CA Form ---
  const handleCaChange = (e) => {
    setCaData({ ...caData, [e.target.name]: e.target.value });
  };

  const handleCaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (caData.password !== caData.confirmPassword) {
        setError("Passwords do not match!");
        return;
    }
    try {
        const response = await axios.post('http://localhost:5001/api/ca/auth/register', {
            name: caData.name,
            email: caData.email,
            icaiNumber: caData.icaiNumber,
            password: caData.password,
        });
        if (response.data.token) {
            // Store CA token and data
            localStorage.setItem('ca_token', response.data.token);
            localStorage.setItem('ca_user', JSON.stringify({
              id: response.data._id,
              name: response.data.name,
              email: response.data.email,
              icaiNumber: response.data.icaiNumber
            }));
            
            console.log('CA registration successful');
            alert('CA registration successful! Please login.');
            navigate('/login');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'CA Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#FFF7DD] p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex justify-center">
            <img src={logoUrl} alt="TaxSage Logo" className="w-24" />
        </div>
        <div className="text-center">
  <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-2">Create Your Account</h2>
  <p className="text-sm text-gray-500 font-light">Join us to make tax filing simple</p>
</div>
        <div className="flex bg-[#91C4C3] rounded-lg p-1">
          <button onClick={() => setActiveForm('user')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-all duration-300 ${activeForm === 'user' ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-white'}`}>I'm a User</button>
          <button onClick={() => setActiveForm('ca')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-all duration-300 ${activeForm === 'ca' ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-white'}`}>I'm a CA</button>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* User Signup Form */}
        <form onSubmit={handleUserSubmit} className={`space-y-4 ${activeForm === 'user' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" id="firstName" value={userData.firstName} onChange={handleUserChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="John" />
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" id="lastName" value={userData.lastName} onChange={handleUserChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label htmlFor="user-email" className="text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" id="user-email" value={userData.email} onChange={handleUserChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="pan" className="text-sm font-medium text-gray-700">PAN Number</label>
            <input type="text" name="pan" id="pan" value={userData.pan} onChange={handleUserChange} required maxLength="10" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Please enter a valid PAN number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="ABCDE1234F" />
          </div>
          <div>
            <label htmlFor="user-password" className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="user-password" value={userData.password} onChange={handleUserChange} required minLength="6" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="Minimum 6 characters" />
          </div>
          <div>
            <label htmlFor="user-confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" name="confirmPassword" id="user-confirmPassword" value={userData.confirmPassword} onChange={handleUserChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="Re-enter your password" />
          </div>
          <button type="submit" className="w-full bg-[#80A1BA] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6d8da4] transition-colors">Create User Account</button>
        </form>

        {/* CA Signup Form */}
        <form onSubmit={handleCaSubmit} className={`space-y-4 ${activeForm === 'ca' ? 'block' : 'hidden'}`}>
           <div>
              <label htmlFor="ca-name" className="text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" id="ca-name" value={caData.name} onChange={handleCaChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="CA. John Doe" />
            </div>
            <div>
              <label htmlFor="ca-email" className="text-sm font-medium text-gray-700">Official Email Address</label>
              <input type="email" name="email" id="ca-email" value={caData.email} onChange={handleCaChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="ca@yourfirm.com" />
            </div>
            <div>
              <label htmlFor="icaiNumber" className="text-sm font-medium text-gray-700">ICAI Membership Number</label>
              <input type="text" name="icaiNumber" id="icaiNumber" value={caData.icaiNumber} onChange={handleCaChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="e.g., 123456" />
            </div>
            <div>
              <label htmlFor="ca-password" className="text-sm font-medium text-gray-700">Create Password</label>
              <input type="password" name="password" id="ca-password" value={caData.password} onChange={handleCaChange} required minLength="6" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="Minimum 6 characters" />
            </div>
            <div>
              <label htmlFor="ca-confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="confirmPassword" id="ca-confirmPassword" value={caData.confirmPassword} onChange={handleCaChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80A1BA]" placeholder="Re-enter your password" />
            </div>
            <button type="submit" className="w-full bg-[#80A1BA] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6d8da4] transition-colors">Create CA Account</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-gray-800 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;