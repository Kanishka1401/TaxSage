import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';

// Import your logo (adjust path as needed)
import Logo from '../../assets/logo.png';

// Icon Components
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const SavingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ProgressIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { taxFilings, documents } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filingStatus, setFilingStatus] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setFilingStatus(status);
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  // Calculate dashboard stats from actual data
  const dashboardStats = {
    pendingFilings: taxFilings.filter(f => f.status === 'pending_review').length,
    completedFilings: taxFilings.filter(f => f.status === 'filed' || f.status === 'completed').length,
    totalDocuments: documents.length,
    taxSaved: taxFilings.reduce((total, filing) => total + (filing.taxSaved || 0), 0),
  };

  // Calculate progress based on filing status
  const getFilingProgress = () => {
    if (taxFilings.length === 0) return 0;
    
    const latestFiling = taxFilings[0];
    
    switch (latestFiling.status) {
      case 'draft':
        return documents.length > 0 ? 25 : 10;
      case 'pending_review':
        return 50;
      case 'submitted':
        return 75;
      case 'filed':
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const filingProgress = getFilingProgress();

  // Get current filing status message
  const getFilingStatusMessage = () => {
    if (taxFilings.length === 0) {
      return 'Start your tax filing to begin the process';
    }
    
    const latestFiling = taxFilings[0];
    switch (latestFiling.status) {
      case 'draft':
        return documents.length > 0 
          ? 'Documents uploaded! Continue with your filing' 
          : 'Filing started - Upload your documents to continue';
      case 'pending_review':
        return 'Your filing is under review by a CA expert';
      case 'submitted':
        return 'Filing submitted! Under final verification';
      case 'filed':
      case 'completed':
        return 'ITR filed successfully! Your process is complete';
      default:
        return 'Start your tax filing to begin the process';
    }
  };

  // Get recent filings (last 5)
  const recentFilings = taxFilings.slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartFiling = () => {
    navigate('/tax-filing');
  };

  const handleTaxCalculator = () => {
    navigate('/tax-calculator');
  };

  const handleDocuments = () => {
    navigate('/documents');
  };

  const handleFindCA = () => {
    navigate('/find-ca');
  };

  const handleHelpGuide = () => {
    navigate('/help-guide');
  };

  const handleViewFiling = (filingId) => {
    navigate(`/filing/${filingId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'bg-[#98c1d9] text-[#293241] border-[#98c1d9]';
      case 'submitted': return 'bg-[#3d5a80] text-white border-[#3d5a80]';
      case 'filed': return 'bg-[#293241] text-white border-[#293241]';
      case 'completed': return 'bg-[#293241] text-white border-[#293241]';
      case 'draft': return 'bg-[#e0fbfc] text-[#293241] border-[#98c1d9]';
      default: return 'bg-[#e0fbfc] text-[#293241] border-[#98c1d9]';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_review': return 'Under CA Review';
      case 'submitted': return 'Submitted';
      case 'filed': return 'Filed Successfully';
      case 'completed': return 'Completed';
      case 'draft': return 'Draft - In Progress';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Horizontal Navigation Items
  const navItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'documents', label: 'Documents', action: handleDocuments },
    { key: 'filing', label: 'Filing', action: handleStartFiling },
    { key: 'calculator', label: 'Tax Calculator', action: handleTaxCalculator },
    { key: 'expert', label: 'Find CA Expert', action: handleFindCA },
    { key: 'help', label: 'Help & Guide', action: handleHelpGuide },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      {/* Status Alert */}
      {filingStatus && (
        <div className="bg-[#3d5a80] text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {filingStatus === 'pending_review' && 'Your tax filing has been saved and sent to a CA for review.'}
                  {filingStatus === 'submitted' && 'Your tax filing has been submitted successfully!'}
                  {filingStatus === 'filed' && 'Your Income Tax Return has been filed successfully!'}
                  {filingStatus === 'draft' && 'Your tax filing has been saved as draft. You can continue anytime.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setFilingStatus(null)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Replace with your actual logo */}
              <div className="w-15 h-15 flex items-center justify-center mr-3">
                <img src={Logo} alt="TaxSage Logo" className="w-8 h-8" />
                {/* Fallback if logo not available */}
                {/* <span className="text-white font-bold text-lg">TS</span> */}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#293241]">TaxSage Dashboard</h1>
                <p className="text-[#3d5a80] text-sm">Welcome back, {user?.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="h-8 w-8 rounded-full bg-[#98c1d9] flex items-center justify-center text-[#293241] font-medium hover:bg-[#89b4cc] transition-colors"
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#98c1d9] py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#e0fbfc]">
                      <p className="text-sm font-medium text-[#293241]">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-[#3d5a80]">{user?.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#ee6c4d] hover:bg-[#e0fbfc] flex items-center space-x-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Navigation */}
      <div className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  if (item.action) {
                    item.action();
                  }
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === item.key
                    ? 'border-[#3d5a80] text-[#3d5a80]'
                    : 'border-transparent text-[#3d5a80] hover:text-[#293241] hover:border-[#98c1d9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { 
              title: 'Pending Filings', 
              value: dashboardStats.pendingFilings, 
              icon: <DocumentIcon />,
              bgColor: 'bg-[#e0fbfc]',
              borderColor: 'border-[#98c1d9]',
              textColor: 'text-[#3d5a80]'
            },
            { 
              title: 'Completed Filings', 
              value: dashboardStats.completedFilings, 
              icon: <CheckIcon />,
              bgColor: 'bg-[#98c1d9]',
              borderColor: 'border-[#3d5a80]',
              textColor: 'text-[#293241]'
            },
            { 
              title: 'Total Documents', 
              value: dashboardStats.totalDocuments, 
              icon: <DocumentIcon />,
              bgColor: 'bg-[#3d5a80]',
              borderColor: 'border-[#293241]',
              textColor: 'text-white'
            },
            { 
              title: 'Tax Saved', 
              value: `₹${dashboardStats.taxSaved.toLocaleString()}`, 
              icon: <SavingsIcon />,
              bgColor: 'bg-[#ee6c4d]',
              borderColor: 'border-[#ee6c4d]',
              textColor: 'text-white'
            },
          ].map((stat, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-sm p-6 border ${stat.borderColor} hover:shadow-md transition-shadow`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3 ${stat.textColor}`}>
                  {stat.icon}
                </div>
                <div className="ml-4 flex-1">
                  <dt className="text-sm font-medium text-[#3d5a80] truncate">{stat.title}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-[#293241]">{stat.value}</div>
                  </dd>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Filing Progress - Dynamic */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#98c1d9] mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#293241] flex items-center">
                  <ProgressIcon />
                  <span className="ml-2">ITR Filing Progress</span>
                </h3>
                <span className="text-sm font-medium text-[#3d5a80]">
                  {taxFilings.length > 0 ? `${filingProgress}% Complete` : 'Not Started'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[#e0fbfc] rounded-full h-2.5">
                <div 
                  className="bg-[#3d5a80] h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${filingProgress}%` }}
                ></div>
              </div>
              
              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                {[
                  { label: 'Document Upload', progress: 25, completed: documents.length > 0 },
                  { label: 'CA Review', progress: 50, completed: taxFilings.some(f => f.status === 'pending_review') },
                  { label: 'Verification', progress: 75, completed: taxFilings.some(f => f.status === 'submitted') },
                  { label: 'Filing', progress: 100, completed: taxFilings.some(f => f.status === 'filed') }
                ].map((step, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      filingProgress >= step.progress 
                        ? 'bg-[#98c1d9] text-[#293241] border-[#3d5a80]' 
                        : 'bg-[#e0fbfc] text-[#3d5a80] border-[#98c1d9]'
                    }`}
                  >
                    <div className="text-sm font-medium">{step.label}</div>
                    <div className="text-xs mt-1">
                      {step.completed ? (
                        <CheckIcon />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#98c1d9] rounded-full mx-auto"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Status Message */}
              <div className="mt-6 p-4 bg-[#e0fbfc] rounded-lg border border-[#98c1d9]">
                <p className="text-sm text-[#3d5a80] text-center font-medium">
                  {getFilingStatusMessage()}
                </p>
              </div>
            </div>

            {/* Recent Filings Section */}
            <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9]">
              <div className="px-6 py-5 border-b border-[#98c1d9] flex justify-between items-center">
                <h3 className="text-lg font-semibold leading-6 text-[#293241]">Recent Tax Filings</h3>
                <button 
                  className="bg-[#3d5a80] text-white inline-flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-[#2d4566] transition-colors"
                  onClick={handleStartFiling}
                >
                  Start New Filing
                </button>
              </div>
              <div className="px-6 py-4">
                {recentFilings.length > 0 ? (
                  <div className="overflow-hidden border border-[#98c1d9] rounded-lg">
                    <table className="min-w-full divide-y divide-[#98c1d9]">
                      <thead className="bg-[#e0fbfc]">
                        <tr>
                          <th scope="col" className="py-3 pl-6 pr-3 text-left text-xs font-medium text-[#3d5a80] uppercase tracking-wider">Filing</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-[#3d5a80] uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-[#3d5a80] uppercase tracking-wider">Date</th>
                          <th scope="col" className="relative py-3 pl-3 pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#98c1d9]">
                        {recentFilings.map((filing) => (
                          <tr key={filing.id} className="hover:bg-[#e0fbfc] transition-colors">
                            <td className="py-4 pl-6 pr-3">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="font-medium text-[#293241]">ITR Filing {filing.assessmentYear || '2024-25'}</div>
                                  {filing.taxableIncome && (
                                    <div className="text-[#3d5a80] text-sm">Income: ₹{filing.taxableIncome?.toLocaleString()}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 border ${getStatusColor(filing.status)}`}>
                                {getStatusText(filing.status)}
                              </span>
                            </td>
                            <td className="px-3 py-4 text-sm text-[#3d5a80]">{formatDate(filing.createdAt)}</td>
                            <td className="py-4 pl-3 pr-6 text-right text-sm font-medium">
                              <button 
                                onClick={() => handleViewFiling(filing.id)}
                                className="text-[#3d5a80] hover:text-[#293241] transition-colors font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-[#e0fbfc] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <DocumentIcon />
                    </div>
                    <p className="text-[#3d5a80] font-medium text-lg">No recent tax filings</p>
                    <p className="text-[#98c1d9] text-sm mt-2">Start your first tax filing to see activity here</p>
                    <button 
                      className="mt-6 bg-[#3d5a80] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#2d4566] transition-colors"
                      onClick={handleStartFiling}
                    >
                      Start New Filing
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#98c1d9]">
              <h3 className="text-lg font-semibold text-[#293241] mb-4 flex items-center">
                <HelpIcon />
                <span className="ml-2">Quick Tips</span>
              </h3>
              <div className="space-y-4 text-sm text-[#3d5a80]">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3d5a80] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Upload all your Form-16 documents for automatic data extraction</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3d5a80] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Choose the tax regime that best suits your investment pattern</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3d5a80] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep your investment proofs ready for verification</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3d5a80] rounded-full mt-2 flex-shrink-0"></div>
                  <p>File early to avoid last-minute rush and penalties</p>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-[#3d5a80] shadow-sm rounded-lg p-6 text-white">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#98c1d9] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <UserIcon />
                </div>
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-[#e0fbfc] text-sm mb-4">Our tax experts are here to assist you</p>
                <button 
                  onClick={handleFindCA}
                  className="w-full bg-white text-[#3d5a80] py-2 px-4 rounded-md text-sm font-medium hover:bg-[#e0fbfc] transition-colors"
                >
                  Contact Tax Expert
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#98c1d9]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#e0fbfc] rounded-lg flex items-center justify-center">
                  <SecurityIcon />
                </div>
                <div>
                  <h4 className="font-semibold text-[#293241] text-sm">Bank-Grade Security</h4>
                  <p className="text-[#3d5a80] text-xs">Your data is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Close dropdown when clicking outside */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default UserDashboard;