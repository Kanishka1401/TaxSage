import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx'; // Add this import

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { taxFilings, documents } = useData(); // Use data context
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [filingStatus, setFilingStatus] = useState(null);

  // Check for status from tax filing redirect
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setFilingStatus(status);
      // Clear the status from URL
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

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

  // Calculate dashboard stats from actual data
  const dashboardStats = {
    pendingFilings: taxFilings.filter(f => f.status === 'pending_review').length,
    completedFilings: taxFilings.filter(f => f.status === 'filed' || f.status === 'submitted').length,
    totalDocuments: documents.length,
    taxSaved: taxFilings.reduce((total, filing) => total + (filing.taxSaved || 0), 0),
    currentYear: new Date().getFullYear()
  };

  // Get recent filings (last 5)
  const recentFilings = taxFilings.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'filed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_review': return 'Under CA Review';
      case 'submitted': return 'Submitted';
      case 'filed': return 'Filed Successfully';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Status Alert */}
      {filingStatus && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  {filingStatus === 'pending_review' && 'Your tax filing has been saved and sent to a CA for review.'}
                  {filingStatus === 'submitted' && 'Your tax filing has been submitted successfully!'}
                  {filingStatus === 'filed' && 'Your Income Tax Return has been filed successfully!'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setFilingStatus(null)}
              className="text-blue-400 hover:text-blue-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#80A1BA] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">TaxSage</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.firstName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Income Tax Filing {dashboardStats.currentYear}-{dashboardStats.currentYear + 1}
              </h2>
              <p className="text-gray-600 mb-6">
                Complete your tax return with our guided process. Get expert recommendations and ensure maximum savings.
              </p>
              <button
                onClick={handleStartFiling}
                className="bg-[#80A1BA] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#6d8da4] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Start New Filing
              </button>
            </div>
            <div className="bg-[#91C4C3] bg-opacity-10 text-[#91C4C3] p-5 rounded-lg border border-[#91C4C3] border-opacity-20">
              <p className="text-sm font-medium mb-1">Assessment Year</p>
              <p className="text-lg font-semibold">{dashboardStats.currentYear}-{dashboardStats.currentYear + 1}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="bg-[#80A1BA] bg-opacity-10 p-3 rounded-lg">
                <span className="text-[#80A1BA] text-lg">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Pending Filings</p>
                <p className="text-xl font-semibold text-gray-800">{dashboardStats.pendingFilings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="bg-[#B4DEBD] bg-opacity-10 p-3 rounded-lg">
                <span className="text-[#B4DEBD] text-lg">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Completed Filings</p>
                <p className="text-xl font-semibold text-gray-800">{dashboardStats.completedFilings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="bg-[#91C4C3] bg-opacity-10 p-3 rounded-lg">
                <span className="text-[#91C4C3] text-lg">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Tax Saved</p>
                <p className="text-xl font-semibold text-gray-800">₹{dashboardStats.taxSaved.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="bg-purple-500 bg-opacity-10 p-3 rounded-lg">
                <span className="text-purple-500 text-lg">📁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Documents</p>
                <p className="text-xl font-semibold text-gray-800">{dashboardStats.totalDocuments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-7 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={handleTaxCalculator}
              className="bg-gray-50 hover:bg-[#80A1BA] hover:text-white transition-all duration-200 p-5 rounded-lg text-center border border-gray-200 group"
            >
              <div className="text-lg mb-2 group-hover:scale-110 transition-transform">📊</div>
              <p className="font-medium text-sm">Tax Calculator</p>
            </button>
            <button 
              onClick={handleDocuments}
              className="bg-gray-50 hover:bg-[#80A1BA] hover:text-white transition-all duration-200 p-5 rounded-lg text-center border border-gray-200 group"
            >
              <div className="text-lg mb-2 group-hover:scale-110 transition-transform">📁</div>
              <p className="font-medium text-sm">Documents</p>
            </button>
            <button 
              onClick={handleFindCA}
              className="bg-gray-50 hover:bg-[#80A1BA] hover:text-white transition-all duration-200 p-5 rounded-lg text-center border border-gray-200 group"
            >
              <div className="text-lg mb-2 group-hover:scale-110 transition-transform">👨‍💼</div>
              <p className="font-medium text-sm">Find CA</p>
            </button>
            <button 
              onClick={handleHelpGuide}
              className="bg-gray-50 hover:bg-[#80A1BA] hover:text-white transition-all duration-200 p-5 rounded-lg text-center border border-gray-200 group"
            >
              <div className="text-lg mb-2 group-hover:scale-110 transition-transform">❓</div>
              <p className="font-medium text-sm">Help Guide</p>
            </button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm p-7 border border-gray-100 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <span className="text-sm text-gray-500">{taxFilings.length} total filings</span>
          </div>
          {recentFilings.length > 0 ? (
            <div className="space-y-4">
              {recentFilings.map((filing) => (
                <div key={filing.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600">📄</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">ITR Filing {filing.assessmentYear || '2024-25'}</p>
                      <p className="text-sm text-gray-500">Filed on {formatDate(filing.createdAt)}</p>
                      {filing.taxableIncome && (
                        <p className="text-sm text-gray-500">Taxable Income: ₹{filing.taxableIncome?.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(filing.status)}`}>
                      {getStatusText(filing.status)}
                    </span>
                    <button
                      onClick={() => handleViewFiling(filing.id)}
                      className="text-[#80A1BA] hover:text-[#6d8da4] font-medium text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">📄</div>
              <p className="text-gray-500">No recent tax filings</p>
              <p className="text-gray-400 text-sm mt-1">Start your first tax filing to see activity here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;