import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindCA = () => {
  const navigate = useNavigate();
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

  const caProfessionals = [
    {
      id: 1,
      name: 'Ravi Sharma',
      experience: '12 years',
      specialization: 'Income Tax & GST',
      rating: '4.8',
      reviews: '127',
      location: 'Mumbai',
      priceRange: '₹2,000 - ₹5,000',
      consultationFee: 3000,
      languages: ['English', 'Hindi', 'Marathi'],
      availability: 'Mon-Fri, 9AM-6PM',
      description: 'Expert in income tax planning and GST compliance with 12+ years of experience. Specialized in individual and corporate tax filings with a track record of maximizing deductions and ensuring compliance.',
      contact: '+91 98765 43210',
      email: 'ravi.sharma@email.com',
      qualifications: ['CA', 'CS', 'MBA'],
      services: ['ITR Filing', 'GST Registration', 'Tax Planning', 'Audit'],
      responseTime: 'Within 2 hours',
      image: '👨‍💼'
    },
    {
      id: 2,
      name: 'Priya Patel',
      experience: '8 years',
      specialization: 'Tax Planning & Wealth Management',
      rating: '4.9',
      reviews: '89',
      location: 'Delhi',
      priceRange: '₹1,500 - ₹4,000',
      consultationFee: 2500,
      languages: ['English', 'Hindi'],
      availability: 'Mon-Sat, 10AM-7PM',
      description: 'Specialized in tax planning and wealth management for individuals and businesses. Expertise in investment planning, retirement planning, and tax-saving strategies.',
      contact: '+91 98765 43211',
      email: 'priya.patel@email.com',
      qualifications: ['CA', 'CFA'],
      services: ['Wealth Management', 'Tax Planning', 'Investment Advisory'],
      responseTime: 'Within 1 hour',
      image: '👩‍💼'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      experience: '15 years',
      specialization: 'Corporate Tax & International Taxation',
      rating: '4.7',
      reviews: '203',
      location: 'Bangalore',
      priceRange: '₹3,000 - ₹8,000',
      consultationFee: 5000,
      languages: ['English', 'Hindi', 'Kannada'],
      availability: 'Mon-Fri, 8AM-5PM',
      description: 'Corporate tax expert with extensive experience in international taxation. Specialized in M&A tax planning, transfer pricing, and cross-border transactions.',
      contact: '+91 98765 43212',
      email: 'amit.kumar@email.com',
      qualifications: ['CA', 'LLB', 'International Tax Diploma'],
      services: ['Corporate Tax', 'International Tax', 'Transfer Pricing'],
      responseTime: 'Within 4 hours',
      image: '👨‍💼'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      experience: '6 years',
      specialization: 'Startup Taxation & Compliance',
      rating: '4.6',
      reviews: '67',
      location: 'Hyderabad',
      priceRange: '₹1,000 - ₹3,000',
      consultationFee: 2000,
      languages: ['English', 'Hindi', 'Telugu'],
      availability: 'Mon-Sat, 9AM-8PM',
      description: 'Focused on startup ecosystem with expertise in company registration, compliance, and early-stage tax planning. Great with first-time entrepreneurs.',
      contact: '+91 98765 43213',
      email: 'sneha.reddy@email.com',
      qualifications: ['CA', 'Startup Consultant'],
      services: ['Startup Registration', 'Compliance', 'Funding Advisory'],
      responseTime: 'Within 30 minutes',
      image: '👩‍💼'
    }
  ];

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

  const filteredCAs = caProfessionals.filter(ca => {
    const matchesLocation = !filters.location || filters.location === 'All Locations' || ca.location === filters.location;
    const matchesSpecialization = !filters.specialization || filters.specialization === 'All Specializations' || ca.specialization.includes(filters.specialization);
    const matchesRating = !filters.rating || parseFloat(ca.rating) >= parseFloat(filters.rating);
    const matchesMinPrice = !filters.minPrice || ca.consultationFee >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || ca.consultationFee <= parseInt(filters.maxPrice);
    
    // Experience filter logic
    let matchesExperience = true;
    if (filters.experience && filters.experience !== 'Any Experience') {
      const [minExp] = filters.experization.split('-');
      const caExp = parseInt(ca.experience);
      if (filters.experience === '10+ years') {
        matchesExperience = caExp >= 10;
      } else {
        matchesExperience = caExp >= parseInt(minExp);
      }
    }

    return matchesLocation && matchesSpecialization && matchesRating && matchesMinPrice && matchesMaxPrice && matchesExperience;
  });

  const activeFilterCount = Object.values(filters).filter(value => value && value !== 'All Locations' && value !== 'All Specializations' && value !== 'Any Experience').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Find CA Professionals</h1>
              <p className="text-gray-600">Connect with certified Chartered Accountants for expert tax guidance</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select 
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
                >
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select 
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
                >
                  {experiences.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Consultation Fee</label>
                <select 
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
                >
                  <option value="">Any</option>
                  <option value="1000">₹1,000</option>
                  <option value="2000">₹2,000</option>
                  <option value="3000">₹3,000</option>
                  <option value="5000">₹5,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Consultation Fee</label>
                <select 
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
                >
                  <option value="">Any</option>
                  <option value="3000">₹3,000</option>
                  <option value="5000">₹5,000</option>
                  <option value="8000">₹8,000</option>
                  <option value="10000">₹10,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select 
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {filteredCAs.length} CA{filteredCAs.length !== 1 ? 's' : ''} Found
              {activeFilterCount > 0 && ' (Filtered)'}
            </h3>
            <div className="text-sm text-gray-500">
              Sorted by: <span className="font-medium">Rating</span>
            </div>
          </div>

          {/* CA Listings */}
          <div className="space-y-6">
            {filteredCAs.map((ca) => (
              <div key={ca.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-20 h-20 bg-[#80A1BA] rounded-full flex items-center justify-center text-2xl text-white">
                      {ca.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{ca.name}</h3>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{ca.rating}</span>
                          <span className="text-gray-500">({ca.reviews} reviews)</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{ca.specialization}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
                        <span>📍 {ca.location}</span>
                        <span>•</span>
                        <span>🕐 {ca.experience} experience</span>
                        <span>•</span>
                        <span className="font-medium text-green-600">{ca.priceRange}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {ca.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                        {ca.services.length > 3 && (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                            +{ca.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Response time</p>
                      <p className="text-sm font-medium text-green-600">{ca.responseTime}</p>
                    </div>
                    <button 
                      onClick={() => handleContactCA(ca)}
                      className="bg-[#80A1BA] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#6d8da4] transition-colors whitespace-nowrap"
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
              <div className="text-gray-400 text-6xl mb-4">👨‍💼</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No CAs found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
              <button
                onClick={clearFilters}
                className="bg-[#80A1BA] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#6d8da4] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CA Profile Modal */}
      {selectedCA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCA.name}'s Profile</h2>
                <button 
                  onClick={handleCloseProfile}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-[#80A1BA] rounded-full flex items-center justify-center text-3xl text-white">
                  {selectedCA.image}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800">{selectedCA.name}</h3>
                      <p className="text-gray-600 text-lg">{selectedCA.specialization}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <span className="text-yellow-500 text-xl">⭐</span>
                      <span className="font-semibold text-lg">{selectedCA.rating}</span>
                      <span className="text-gray-500">({selectedCA.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📍 {selectedCA.location}</span>
                    <span>🕐 {selectedCA.experience} experience</span>
                    <span className="font-semibold text-green-600">💵 {selectedCA.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Qualifications & Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Qualifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCA.qualifications.map((qual, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCA.services.map((service, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* About & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">About</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedCA.description}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-medium">{selectedCA.availability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium text-green-600">{selectedCA.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Languages:</span>
                        <span className="font-medium">{selectedCA.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 text-xl">📞</span>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">{selectedCA.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 text-xl">✉️</span>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{selectedCA.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button 
                  onClick={() => window.open(`tel:${selectedCA.contact}`, '_self')}
                  className="flex-1 bg-[#80A1BA] text-white py-3 rounded-lg font-semibold hover:bg-[#6d8da4] transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📞</span>
                  <span>Call Now</span>
                </button>
                <button 
                  onClick={() => window.open(`mailto:${selectedCA.email}?subject=Tax Consultation&body=Hello ${selectedCA.name}, I would like to consult regarding tax services.`, '_self')}
                  className="flex-1 border border-[#80A1BA] text-[#80A1BA] py-3 rounded-lg font-semibold hover:bg-[#80A1BA] hover:text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <span>✉️</span>
                  <span>Send Email</span>
                </button>
                <button 
                  onClick={() => {
                    alert(`Booking request sent to ${selectedCA.name}! They will contact you within ${selectedCA.responseTime}.`);
                    handleCloseProfile();
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📅</span>
                  <span>Book Consultation</span>
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