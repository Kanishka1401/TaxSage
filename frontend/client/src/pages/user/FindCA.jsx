import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

// Icon Components
const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ExperienceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FindCA = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    location: '',
    specialization: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    experience: ''
  });
  const [selectedCA, setSelectedCA] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    serviceType: '',
    urgency: 'medium',
    message: ''
  });
  const [caProfessionals, setCaProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDemoCAData = () => [
    {
      id: 1,
      name: 'Kanishka Siyal',
      experience: 12,
      specialization: 'Income Tax & GST',
      rating: 4.8,
      reviews: 127,
      location: 'Mumbai',
      consultationFee: 3000,
      priceRange: '₹2,000 - ₹5,000',
      languages: ['English', 'Hindi', 'Marathi'],
      availability: 'Mon-Fri, 9AM-6PM',
      description: 'Expert in income tax planning and GST compliance with 12+ years of experience. Specialized in individual and corporate tax filings.',
      contact: '+91 98765 43210',
      email: 'ravi.sharma@email.com',
      qualifications: ['CA', 'CS', 'MBA'],
      services: ['ITR Filing', 'GST Registration', 'Tax Planning', 'Audit'],
      responseTime: 'Within 2 hours',
      imageUrl: null,
      isActive: true
    },
    {
      id: 2,
      name: 'Kashvi Thakkar',
      experience: 12,
      specialization: 'Income Tax & GST',
      rating: 4.8,
      reviews: 127,
      location: 'Mumbai',
      consultationFee: 3000,
      priceRange: '₹2,000 - ₹5,000',
      languages: ['English', 'Hindi', 'Marathi'],
      availability: 'Mon-Fri, 9AM-6PM',
      description: 'Expert in income tax planning and GST compliance with 12+ years of experience. Specialized in individual and corporate tax filings.',
      contact: '+91 98765 43210',
      email: 'ravi.sharma@email.com',
      qualifications: ['CA', 'CS', 'MBA'],
      services: ['ITR Filing', 'GST Registration', 'Tax Planning', 'Audit'],
      responseTime: 'Within 2 hours',
      imageUrl: null,
      isActive: true
    },
    {
      id: 3,
      name: 'Priya Sharma',
      experience: 8,
      specialization: 'Tax Planning & Corporate Tax',
      rating: 4.9,
      reviews: 95,
      location: 'Delhi',
      consultationFee: 2500,
      priceRange: '₹2,000 - ₹4,000',
      languages: ['English', 'Hindi', 'Gujarati'],
      availability: 'Mon-Sat, 10AM-7PM',
      description: 'Specializing in corporate tax planning and compliance. Expert in startups and SME taxation.',
      contact: '+91 98765 43211',
      email: 'priya.patel@email.com',
      qualifications: ['CA', 'CFA'],
      services: ['Corporate Tax', 'Tax Planning', 'Startup Advisory', 'Compliance'],
      responseTime: 'Within 1 hour',
      imageUrl: null,
      isActive: true
    }
  ];

  // Fetch CA professionals when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // For now, use demo data directly instead of trying to fetch from backend
        console.log('Using demo data for CA professionals');
        const demoData = getDemoCAData();
        console.log('Demo data:', demoData);
        setCaProfessionals(demoData);
      } catch (err) {
        console.error('Error setting CA professionals:', err);
        setError('Failed to load CA professionals');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const locations = ['All Locations', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];
  const specializations = ['All Specializations', 'Income Tax', 'GST', 'Tax Planning', 'Corporate Tax', 'Audit', 'Wealth Management', 'Startup Taxation'];
  const experiences = ['Any Experience', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleContactCA = (ca) => {
    setSelectedCA(ca);
  };

  const handleCloseProfile = () => {
    setSelectedCA(null);
    setShowRequestForm(false);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      specialization: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      experience: ''
    });
  };

  const handleSendRequest = (ca) => {
    if (!user) {
      alert('Please login to send a request');
      navigate('/login');
      return;
    }
    setSelectedCA(ca);
    setShowRequestForm(true);
  };

  const handleSubmitRequest = async () => {
    if (!requestData.serviceType || !requestData.message) {
      alert('Please fill in all required fields');
      return;
    }

    const request = {
      id: Date.now().toString(),
      clientId: user?.id,
      clientName: `${user?.firstName} ${user?.lastName}`,
      clientEmail: user?.email,
      caId: selectedCA.id,
      caName: selectedCA.name,
      serviceType: requestData.serviceType,
      urgency: requestData.urgency,
      message: requestData.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Send request to backend API
      const response = await fetch('/api/ca-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      alert(`Request sent to ${selectedCA.name} successfully! They will contact you soon.`);
      setShowRequestForm(false);
      setSelectedCA(null);
      setRequestData({
        serviceType: '',
        urgency: 'medium',
        message: ''
      });
    } catch (error) {
      console.error('Error sending request:', error);
      
      // Fallback to localStorage
      const existingRequests = JSON.parse(localStorage.getItem('caRequests') || '[]');
      const updatedRequests = [...existingRequests, request];
      localStorage.setItem('caRequests', JSON.stringify(updatedRequests));
      
      alert(`Request sent to ${selectedCA.name} successfully! They will contact you soon.`);
      setShowRequestForm(false);
      setSelectedCA(null);
      setRequestData({
        serviceType: '',
        urgency: 'medium',
        message: ''
      });
    }
  };

  console.log('Current CA professionals:', caProfessionals);
  const filteredCAs = caProfessionals.filter(ca => {
    if (!ca || !ca.isActive) return false;
    
    const matchesLocation = !filters.location || filters.location === 'All Locations' || ca.location === filters.location;
    const matchesSpecialization = !filters.specialization || filters.specialization === 'All Specializations' || ca.specialization.includes(filters.specialization);
    const matchesRating = !filters.rating || ca.rating >= parseFloat(filters.rating);
    const matchesMinPrice = !filters.minPrice || ca.consultationFee >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || ca.consultationFee <= parseInt(filters.maxPrice);
    
    let matchesExperience = true;
    if (filters.experience && filters.experience !== 'Any Experience') {
      const [minExp] = filters.experience.split('-');
      if (filters.experience === '10+ years') {
        matchesExperience = ca.experience >= 10;
      } else {
        matchesExperience = ca.experience >= parseInt(minExp);
      }
    }

    return matchesLocation && matchesSpecialization && matchesRating && matchesMinPrice && matchesMaxPrice && matchesExperience;
  });

  const activeFilterCount = Object.values(filters).filter(value => value && value !== 'All Locations' && value !== 'All Specializations' && value !== 'Any Experience').length;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-[#3d5a80] hover:text-[#293241] transition-colors mr-6"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[#293241]">Find CA Professionals</h1>
                <p className="text-[#3d5a80] text-sm">Connect with certified Chartered Accountants for expert tax guidance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#293241] mb-2">Available CA Professionals</h2>
              <p className="text-[#3d5a80]">Browse and connect with certified experts</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-[#e0fbfc] hover:bg-[#98c1d9] text-[#3d5a80] py-2 px-4 rounded-lg transition-colors border border-[#98c1d9]"
              >
                <FilterIcon />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[#ee6c4d] hover:text-[#d45a3d] py-2 px-4 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#e0fbfc] border border-[#98c1d9] rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#3d5a80] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-[#3d5a80]">{error}</span>
              </div>
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-6 bg-[#e0fbfc] rounded-lg border border-[#98c1d9]">
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">Location</label>
                <select 
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors bg-white"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">Specialization</label>
                <select 
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors bg-white"
                >
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">Experience</label>
                <select 
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors bg-white"
                >
                  {experiences.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">Min Consultation Fee</label>
                <select 
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors bg-white"
                >
                  <option value="">Any</option>
                  <option value="1000">₹1,000</option>
                  <option value="2000">₹2,000</option>
                  <option value="3000">₹3,000</option>
                  <option value="5000">₹5,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">Max Consultation Fee</label>
                <select 
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors bg-white"
                >
                  <option value="">Any</option>
                  <option value="3000">₹3,000</option>
                  <option value="5000">₹5,000</option>
                  <option value="8000">₹8,000</option>
                  <option value="10000">₹10,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">Minimum Rating</label>
                <select 
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors bg-white"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>
          )}

          {/* CA Listings */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d5a80] mx-auto"></div>
              <p className="text-[#3d5a80] mt-4">Loading CA professionals...</p>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#293241]">
                  {filteredCAs.length} CA{filteredCAs.length !== 1 ? 's' : ''} Found
                  {activeFilterCount > 0 && ' (Filtered)'}
                </h3>
                <div className="text-sm text-[#3d5a80]">
                  Sorted by: <span className="font-medium">Rating</span>
                </div>
              </div>

              {/* CA Listings */}
              <div className="space-y-6">
                {filteredCAs.map((ca) => (
                  <div key={ca.id} className="border border-[#98c1d9] rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-20 h-20 bg-[#3d5a80] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                          {ca.imageUrl ? (
                            <img src={ca.imageUrl} alt={ca.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(ca.name)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h3 className="text-xl font-semibold text-[#293241]">{ca.name}</h3>
                            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                              <StarIcon />
                              <span className="font-semibold text-[#293241]">{ca.rating}</span>
                              <span className="text-[#3d5a80]">({ca.reviews} reviews)</span>
                            </div>
                          </div>
                          <p className="text-[#3d5a80] mb-2">{ca.specialization}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-[#3d5a80] mb-3">
                            <span className="flex items-center space-x-1">
                              <LocationIcon />
                              <span>{ca.location}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <ExperienceIcon />
                              <span>{ca.experience} years experience</span>
                            </span>
                            <span>•</span>
                            <span className="font-medium text-green-600">{ca.priceRange}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {ca.services.slice(0, 3).map((service, index) => (
                              <span key={index} className="bg-[#e0fbfc] text-[#3d5a80] px-2 py-1 rounded text-xs border border-[#98c1d9]">
                                {service}
                              </span>
                            ))}
                            {ca.services.length > 3 && (
                              <span className="bg-[#e0fbfc] text-[#3d5a80] px-2 py-1 rounded text-xs border border-[#98c1d9]">
                                +{ca.services.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-3">
                        <div className="text-right">
                          <p className="text-sm text-[#3d5a80]">Response time</p>
                          <p className="text-sm font-medium text-green-600">{ca.responseTime}</p>
                        </div>
                        <button 
                          onClick={() => handleContactCA(ca)}
                          className="bg-[#3d5a80] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#2d4566] transition-colors whitespace-nowrap"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCAs.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#e0fbfc] rounded-full flex items-center justify-center text-[#3d5a80] mx-auto mb-4">
                    <UserIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-[#293241] mb-2">No CAs found</h3>
                  <p className="text-[#3d5a80] mb-4">Try adjusting your filters to see more results</p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#3d5a80] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#2d4566] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CA Profile Modal */}
      {selectedCA && !showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#98c1d9] sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#293241]">{selectedCA.name}'s Profile</h2>
                <button 
                  onClick={handleCloseProfile}
                  className="text-[#3d5a80] hover:text-[#293241] transition-colors p-1 rounded-full hover:bg-[#e0fbfc]"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-[#3d5a80] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {selectedCA.imageUrl ? (
                    <img src={selectedCA.imageUrl} alt={selectedCA.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(selectedCA.name)
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#293241]">{selectedCA.name}</h3>
                      <p className="text-[#3d5a80] text-lg">{selectedCA.specialization}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <StarIcon />
                      <span className="font-semibold text-lg text-[#293241]">{selectedCA.rating}</span>
                      <span className="text-[#3d5a80]">({selectedCA.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#3d5a80]">
                    <span className="flex items-center space-x-1">
                      <LocationIcon />
                      <span>{selectedCA.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ExperienceIcon />
                      <span>{selectedCA.experience} years experience</span>
                    </span>
                    <span className="font-semibold text-green-600">💵 {selectedCA.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Qualifications & Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#293241] mb-3">Qualifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCA.qualifications.map((qual, index) => (
                      <span key={index} className="bg-[#e0fbfc] text-[#3d5a80] px-3 py-1 rounded-full text-sm font-medium border border-[#98c1d9]">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#293241] mb-3">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCA.services.map((service, index) => (
                      <span key={index} className="bg-[#98c1d9] text-[#293241] px-3 py-1 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* About & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#293241] mb-3">About</h4>
                  <p className="text-[#3d5a80] leading-relaxed">{selectedCA.description}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-[#293241] mb-3">Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#3d5a80]">Availability:</span>
                        <span className="font-medium text-[#293241]">{selectedCA.availability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#3d5a80]">Response Time:</span>
                        <span className="font-medium text-green-600">{selectedCA.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#3d5a80]">Languages:</span>
                        <span className="font-medium text-[#293241]">{selectedCA.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-[#98c1d9] pt-6">
                <h4 className="text-lg font-semibold text-[#293241] mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-[#e0fbfc] rounded-lg border border-[#98c1d9]">
                    <PhoneIcon />
                    <div>
                      <p className="text-sm text-[#3d5a80]">Phone</p>
                      <p className="font-medium text-[#293241]">{selectedCA.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-[#e0fbfc] rounded-lg border border-[#98c1d9]">
                    <MailIcon />
                    <div>
                      <p className="text-sm text-[#3d5a80]">Email</p>
                      <p className="font-medium text-[#293241]">{selectedCA.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#98c1d9]">
                <button 
                  onClick={() => handleSendRequest(selectedCA)}
                  className="flex-1 bg-[#3d5a80] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors flex items-center justify-center space-x-2"
                >
                  <MailIcon />
                  <span>Send Request</span>
                </button>
                <button 
                  onClick={() => window.open(`tel:${selectedCA.contact}`, '_self')}
                  className="flex-1 border border-[#3d5a80] text-[#3d5a80] py-3 rounded-lg font-semibold hover:bg-[#3d5a80] hover:text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <PhoneIcon />
                  <span>Call Directly</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && selectedCA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-[#98c1d9]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#293241]">Send Request to {selectedCA.name}</h2>
                <button 
                  onClick={() => setShowRequestForm(false)}
                  className="text-[#3d5a80] hover:text-[#293241] transition-colors p-1 rounded-full hover:bg-[#e0fbfc]"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">
                  Service Required *
                </label>
                <select 
                  value={requestData.serviceType}
                  onChange={(e) => setRequestData(prev => ({...prev, serviceType: e.target.value}))}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] bg-white"
                  required
                >
                  <option value="">Select Service</option>
                  <option value="ITR Filing">Income Tax Return Filing</option>
                  <option value="GST Registration">GST Registration & Filing</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Audit">Audit Services</option>
                  <option value="Consultation">General Consultation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">
                  Urgency *
                </label>
                <select 
                  value={requestData.urgency}
                  onChange={(e) => setRequestData(prev => ({...prev, urgency: e.target.value}))}
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] bg-white"
                >
                  <option value="low">Low (Within 2 weeks)</option>
                  <option value="medium">Medium (Within 1 week)</option>
                  <option value="high">High (Within 3 days)</option>
                  <option value="urgent">Urgent (Within 24 hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">
                  Additional Message *
                </label>
                <textarea 
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({...prev, message: e.target.value}))}
                  rows="4"
                  placeholder="Describe your requirements, any specific issues, or questions you have..."
                  className="w-full px-3 py-2 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] resize-none bg-white"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={handleSubmitRequest}
                  className="flex-1 bg-[#3d5a80] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors"
                >
                  Send Request
                </button>
                <button 
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 border border-[#98c1d9] text-[#3d5a80] py-3 rounded-lg font-semibold hover:bg-[#e0fbfc] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindCA;