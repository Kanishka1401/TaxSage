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
    experience: '',
    specialization: '',
    location: '',
    languages: [],
    availability: '',
    consultationFee: '',
    description: '',
    contact: '',
    services: [],
    qualifications: ['CA'],
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
    const { name, value, multiple, options } = e.target;
    
    if (multiple) {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setCaData(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setCaData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCaSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (caData.password !== caData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!caData.name || !caData.email || !caData.icaiNumber || !caData.password) {
      setError("Please fill in all required fields!");
      return;
    }

    // Contact number validation
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(caData.contact)) {
      setError("Please enter a valid 10-digit contact number!");
      return;
    }

    try {
        const response = await axios.post('http://localhost:5001/api/auth/ca/register', {
            name: caData.name,
            email: caData.email,
            icaiNumber: caData.icaiNumber,
            password: caData.password,
            specialization: caData.specialization,
            yearsOfExperience: parseInt(caData.yearsOfExperience),
            location: caData.location,
            languages: caData.languages,
            availability: caData.availability,
            consultationFee: parseInt(caData.consultationFee),
            description: caData.description,
            contact: caData.contact,
            services: caData.services
        });

        if (response.data) {
            console.log('CA registration successful');
            alert('CA registration successful! Please login.');
            navigate('/login');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'CA Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm border border-[#98c1d9] p-8 space-y-6">
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
          <h2 className="text-lg font-semibold text-[#293241] mb-2">Create Your Account</h2>
          <p className="text-sm text-[#3d5a80]">Join us to make tax filing simple</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#e0fbfc] rounded-lg p-1 border border-[#98c1d9]">
          <button 
            onClick={() => setActiveForm('user')} 
            className={`flex-1 p-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeForm === 'user' 
                ? 'bg-[#3d5a80] text-white shadow-sm' 
                : 'bg-transparent text-[#3d5a80] hover:bg-[#98c1d9] hover:text-white'
            }`}
          >
            I'm a User
          </button>
          <button 
            onClick={() => setActiveForm('ca')} 
            className={`flex-1 p-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeForm === 'ca' 
                ? 'bg-[#3d5a80] text-white shadow-sm' 
                : 'bg-transparent text-[#3d5a80] hover:bg-[#98c1d9] hover:text-white'
            }`}
          >
            I'm a CA
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* User Signup Form */}
        <form onSubmit={handleUserSubmit} className={`space-y-4 transition-all duration-300 ${activeForm === 'user' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium text-[#3d5a80] mb-1 block">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                id="firstName" 
                value={userData.firstName} 
                onChange={handleUserChange} 
                required 
                className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
                placeholder="John" 
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm font-medium text-[#3d5a80] mb-1 block">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                id="lastName" 
                value={userData.lastName} 
                onChange={handleUserChange} 
                required 
                className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
                placeholder="Doe" 
              />
            </div>
          </div>
          <div>
            <label htmlFor="user-email" className="text-sm font-medium text-[#3d5a80] mb-1 block">Email Address</label>
            <input 
              type="email" 
              name="email" 
              id="user-email" 
              value={userData.email} 
              onChange={handleUserChange} 
              required 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label htmlFor="pan" className="text-sm font-medium text-[#3d5a80] mb-1 block">PAN Number</label>
            <input 
              type="text" 
              name="pan" 
              id="pan" 
              value={userData.pan} 
              onChange={handleUserChange} 
              required 
              maxLength="10" 
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" 
              title="Please enter a valid PAN number" 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="ABCDE1234F" 
            />
          </div>
          <div>
            <label htmlFor="user-password" className="text-sm font-medium text-[#3d5a80] mb-1 block">Password</label>
            <input 
              type="password" 
              name="password" 
              id="user-password" 
              value={userData.password} 
              onChange={handleUserChange} 
              required 
              minLength="6" 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="Minimum 6 characters" 
            />
          </div>
          <div>
            <label htmlFor="user-confirmPassword" className="text-sm font-medium text-[#3d5a80] mb-1 block">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="user-confirmPassword" 
              value={userData.confirmPassword} 
              onChange={handleUserChange} 
              required 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="Re-enter your password" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#3d5a80] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2d4566] transition-colors duration-300 border border-[#3d5a80]"
          >
            Create User Account
          </button>
        </form>

        {/* CA Signup Form */}
        <form onSubmit={handleCaSubmit} className={`space-y-4 transition-all duration-300 ${activeForm === 'ca' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div>
            <label htmlFor="ca-name" className="text-sm font-medium text-[#3d5a80] mb-1 block">Full Name</label>
            <input 
              type="text" 
              name="name" 
              id="ca-name" 
              value={caData.name} 
              onChange={handleCaChange} 
              required 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="CA. John Doe" 
            />
          </div>
          <div>
            <label htmlFor="ca-email" className="text-sm font-medium text-[#3d5a80] mb-1 block">Official Email Address</label>
            <input 
              type="email" 
              name="email" 
              id="ca-email" 
              value={caData.email} 
              onChange={handleCaChange} 
              required 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="ca@yourfirm.com" 
            />
          </div>
          <div>
            <label htmlFor="icaiNumber" className="text-sm font-medium text-[#3d5a80] mb-1 block">ICAI Membership Number</label>
            <input 
              type="text" 
              name="icaiNumber" 
              id="icaiNumber" 
              value={caData.icaiNumber} 
              onChange={handleCaChange} 
              required 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="e.g., 123456" 
            />
          </div>
          <div>
            <label htmlFor="ca-password" className="text-sm font-medium text-[#3d5a80] mb-1 block">Create Password</label>
            <input 
              type="password" 
              name="password" 
              id="ca-password" 
              value={caData.password} 
              onChange={handleCaChange} 
              required 
              minLength="6" 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="Minimum 6 characters" 
            />
          </div>
          <div>
            <label htmlFor="ca-confirmPassword" className="text-sm font-medium text-[#3d5a80] mb-1 block">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="ca-confirmPassword" 
              value={caData.confirmPassword} 
              onChange={handleCaChange} 
              required 
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
              placeholder="Re-enter your password" 
            />
          </div>
          
          {/* Additional CA Profile Fields */}
          <div>
            <label htmlFor="experience" className="text-sm font-medium text-[#3d5a80] mb-1 block">Years of Experience</label>
            <input 
              type="number" 
              name="yearsOfExperience" 
              id="experience" 
              value={caData.yearsOfExperience} 
              onChange={handleCaChange} 
              required 
              min="0"
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
            />
          </div>

          <div>
            <label htmlFor="specialization" className="text-sm font-medium text-[#3d5a80] mb-1 block">Specialization</label>
            <select
              name="specialization"
              id="specialization"
              value={caData.specialization}
              onChange={handleCaChange}
              required
              multiple
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
            >
              <option value="Income Tax">Income Tax</option>
              <option value="GST">GST</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Audit">Audit</option>
              <option value="Tax Planning">Tax Planning</option>
              <option value="Wealth Management">Wealth Management</option>
              <option value="Startup Taxation">Startup Taxation</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="text-sm font-medium text-[#3d5a80] mb-1 block">Location</label>
            <select
              name="location"
              id="location"
              value={caData.location}
              onChange={handleCaChange}
              required
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
            >
              <option value="">Select Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <div>
            <label htmlFor="languages" className="text-sm font-medium text-[#3d5a80] mb-1 block">Languages Known</label>
            <select
              name="languages"
              id="languages"
              value={caData.languages}
              onChange={handleCaChange}
              required
              multiple
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>

          <div>
            <label htmlFor="availability" className="text-sm font-medium text-[#3d5a80] mb-1 block">Availability Schedule</label>
            <input 
              type="text" 
              name="availability" 
              id="availability" 
              value={caData.availability} 
              onChange={handleCaChange} 
              required 
              placeholder="e.g., Mon-Fri, 9AM-6PM"
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
            />
          </div>

          <div>
            <label htmlFor="consultationFee" className="text-sm font-medium text-[#3d5a80] mb-1 block">Consultation Fee (₹)</label>
            <input 
              type="number" 
              name="consultationFee" 
              id="consultationFee" 
              value={caData.consultationFee} 
              onChange={handleCaChange} 
              required 
              min="0"
              placeholder="e.g., 2000"
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium text-[#3d5a80] mb-1 block">Professional Description</label>
            <textarea 
              name="description" 
              id="description" 
              value={caData.description} 
              onChange={handleCaChange} 
              required 
              rows="3"
              placeholder="Brief description of your expertise and services"
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
            />
          </div>

          <div>
            <label htmlFor="contact" className="text-sm font-medium text-[#3d5a80] mb-1 block">Contact Number</label>
            <input 
              type="tel" 
              name="contact" 
              id="contact" 
              value={caData.contact} 
              onChange={handleCaChange} 
              required 
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors" 
            />
          </div>

          <div>
            <label htmlFor="services" className="text-sm font-medium text-[#3d5a80] mb-1 block">Services Offered</label>
            <select
              name="services"
              id="services"
              value={caData.services}
              onChange={handleCaChange}
              required
              multiple
              className="w-full px-3 py-2 border border-[#98c1d9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
            >
              <option value="ITR Filing">ITR Filing</option>
              <option value="GST Registration">GST Registration</option>
              <option value="Tax Planning">Tax Planning</option>
              <option value="Audit">Audit</option>
              <option value="Business Advisory">Business Advisory</option>
              <option value="Investment Advisory">Investment Advisory</option>
              <option value="Startup Services">Startup Services</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#3d5a80] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2d4566] transition-colors duration-300 border border-[#3d5a80]"
          >
            Create CA Account
          </button>
        </form>

        <p className="text-center text-sm text-[#3d5a80] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#293241] hover:underline hover:text-[#3d5a80] transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;