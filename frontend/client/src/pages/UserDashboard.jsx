import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { taxFilings, documents } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [filingStatus, setFilingStatus] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

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
    completedFilings: taxFilings.filter(f => f.status === 'filed' || f.status === 'submitted').length,
    totalDocuments: documents.length,
    taxSaved: taxFilings.reduce((total, filing) => total + (filing.taxSaved || 0), 0),
    currentYear: new Date().getFullYear(),
    totalIncome: '₹12,50,000',
    taxDue: '₹87,500',
    taxPaid: '₹75,000',
    refund: '₹12,500',
  };

  // Calculate progress based on filing status
  const getFilingProgress = () => {
    if (taxFilings.length === 0) return 0;
    
    const latestFiling = taxFilings[0]; // Get most recent filing
    switch (latestFiling.status) {
      case 'pending_review':
        return 25; // Document uploaded, under CA review
      case 'submitted':
        return 75; // Submitted for processing
      case 'filed':
      case 'completed':
        return 100; // Fully completed
      default:
        return 0; // Not started or draft
    }
  };

  const filingProgress = getFilingProgress();

  // Get recent filings (last 5)
  const recentFilings = taxFilings.slice(0, 5);

  // Sample data for notifications and activities
  const notifications = [
    { id: 1, message: 'Your ITR is under review by CA', time: '2 hours ago', read: false, important: true },
    { id: 2, message: 'Reminder: Upload your investment proofs', time: '1 day ago', read: false, important: true },
    { id: 3, message: 'Tax filing deadline: July 31, 2024', time: '3 days ago', read: true, important: false },
  ];

  const recentActivities = [
    { id: 1, action: 'Document Uploaded', details: 'Form 16', time: '2 hours ago' },
    { id: 2, action: 'CA Assigned', details: 'CA Priya Sharma', time: '5 hours ago' },
    { id: 3, action: 'Profile Updated', details: 'Bank account details', time: '1 day ago' },
  ];

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
      case 'pending_review': return 'bg-[#E5E9C5] text-[#016B61] border-[#9ECFD4]';
      case 'submitted': return 'bg-[#9ECFD4] text-[#016B61] border-[#70B2B2]';
      case 'filed': return 'bg-[#70B2B2] text-white border-[#70B2B2]';
      case 'completed': return 'bg-[#70B2B2] text-white border-[#70B2B2]';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const NotificationItem = ({ notification }) => (
    <div className={`p-3 rounded-lg ${notification.important ? 'bg-[#E5E9C5] border border-[#9ECFD4]' : 'bg-[#9ECFD4] bg-opacity-30'}`}>
      <div className="flex items-start">
        {notification.important && (
          <svg className="h-5 w-5 text-[#70B2B2] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>
        {!notification.read && (
          <span className="ml-2 flex-shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#70B2B2] block"></span>
          </span>
        )}
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="relative pb-8">
      <div className="relative flex items-start space-x-3">
        <div className="relative">
          <div className="h-8 w-8 bg-[#9ECFD4] rounded-full flex items-center justify-center ring-8 ring-white">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div>
            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
            <p className="text-sm text-gray-500">{activity.details}</p>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            <time>{activity.time}</time>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Alert */}
      {filingStatus && (
        <div className="bg-[#70B2B2] text-white p-4">
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
      <header className="bg-[#70B2B2] text-white shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#E5E9C5] rounded-lg flex items-center justify-center mr-3">
                <span className="text-[#70B2B2] font-bold text-lg">TS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">TaxSage Dashboard</h1>
                <p className="text-[#E5E9C5] text-sm">Welcome back, {user?.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-1 text-[#E5E9C5] hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-[#9ECFD4] flex items-center justify-center text-white font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-white shadow-sm border-b border-[#9ECFD4]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['Overview', 'Documents', 'Filing', 'Refund', 'Support'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-[#70B2B2] text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-[#9ECFD4]'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { title: 'Total Income', value: dashboardStats.totalIncome, icon: '💰', bgColor: 'bg-[#E5E9C5]' },
            { title: 'Tax Due', value: dashboardStats.taxDue, icon: '⚠️', bgColor: 'bg-[#9ECFD4]' },
            { title: 'Tax Paid', value: dashboardStats.taxPaid, icon: '✅', bgColor: 'bg-[#70B2B2]' },
            { title: 'Expected Refund', value: dashboardStats.refund, icon: '💸', bgColor: 'bg-[#E5E9C5]' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-[#9ECFD4] hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Filing Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#9ECFD4] mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">ITR Filing Progress</h3>
                <span className="text-sm font-medium text-[#70B2B2]">{filingProgress}% Complete</span>
              </div>
              <div className="w-full bg-[#E5E9C5] rounded-full h-2.5">
                <div 
                  className="bg-[#70B2B2] h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${filingProgress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                <div className={`p-2 rounded-lg ${filingProgress > 0 ? 'bg-[#9ECFD4] text-[#016B61]' : 'bg-[#E5E9C5] text-gray-500'}`}>
                  <div className="text-sm font-medium">Document Upload</div>
                  <div className="text-xs">Step 1</div>
                </div>
                <div className={`p-2 rounded-lg ${filingProgress > 25 ? 'bg-[#9ECFD4] text-[#016B61]' : 'bg-[#E5E9C5] text-gray-500'}`}>
                  <div className="text-sm font-medium">CA Review</div>
                  <div className="text-xs">Step 2</div>
                </div>
                <div className={`p-2 rounded-lg ${filingProgress > 50 ? 'bg-[#9ECFD4] text-[#016B61]' : 'bg-[#E5E9C5] text-gray-500'}`}>
                  <div className="text-sm font-medium">Verification</div>
                  <div className="text-xs">Step 3</div>
                </div>
                <div className={`p-2 rounded-lg ${filingProgress > 75 ? 'bg-[#9ECFD4] text-[#016B61]' : 'bg-[#E5E9C5] text-gray-500'}`}>
                  <div className="text-sm font-medium">Filing</div>
                  <div className="text-xs">Step 4</div>
                </div>
              </div>
            </div>

            {/* Recent Filings Section */}
            <div className="bg-white rounded-xl shadow-sm border border-[#9ECFD4]">
              <div className="px-4 py-5 sm:px-6 border-b border-[#9ECFD4] flex justify-between items-center">
                <h3 className="text-lg font-bold leading-6 text-gray-900">Recent Tax Filings</h3>
                <button 
                  className="bg-[#70B2B2] text-white inline-flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-[#5fa3a3] transition-colors"
                  onClick={handleStartFiling}
                >
                  Start New Filing
                </button>
              </div>
              <div className="px-4 py-4">
                {recentFilings.length > 0 ? (
                  <div className="overflow-hidden border border-[#9ECFD4] rounded-lg">
                    <table className="min-w-full divide-y divide-[#9ECFD4]">
                      <thead className="bg-[#E5E9C5]">
                        <tr>
                          <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filing</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="relative py-3 pl-3 pr-4">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#9ECFD4]">
                        {recentFilings.map((filing) => (
                          <tr key={filing.id} className="border-b border-[#9ECFD4] hover:bg-[#E5E9C5] hover:bg-opacity-30">
                            <td className="py-3 pl-4 pr-3">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">ITR Filing {filing.assessmentYear || '2024-25'}</div>
                                  {filing.taxableIncome && (
                                    <div className="text-gray-500 text-sm">Income: ₹{filing.taxableIncome?.toLocaleString()}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 border ${getStatusColor(filing.status)}`}>
                                {getStatusText(filing.status)}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-500">{formatDate(filing.createdAt)}</td>
                            <td className="py-3 pl-3 pr-4 text-right text-sm font-medium">
                              <button 
                                onClick={() => handleViewFiling(filing.id)}
                                className="text-[#70B2B2] hover:text-[#5fa3a3] transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-[#E5E9C5] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#70B2B2] text-2xl">📄</span>
                    </div>
                    <p className="text-gray-500 font-medium">No recent tax filings</p>
                    <p className="text-gray-400 text-sm mt-1">Start your first tax filing to see activity here</p>
                    <button 
                      className="mt-4 bg-[#70B2B2] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#5fa3a3] transition-colors"
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
            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#9ECFD4]">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
              <div className="mt-4">
                <button className="text-sm font-medium text-[#70B2B2] hover:text-[#5fa3a3] transition-colors">
                  View all notifications
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#9ECFD4]">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, index) => (
                    <li key={activity.id}>
                      <ActivityItem activity={activity} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#70B2B2] shadow-lg rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleFindCA}
                  className="w-full bg-[#9ECFD4] text-[#016B61] py-2 px-4 rounded-md text-sm font-medium hover:bg-[#8fc2c7] transition-colors"
                >
                  Ask Tax Expert
                </button>
                <button 
                  onClick={handleDocuments}
                  className="w-full bg-[#9ECFD4] text-[#016B61] py-2 px-4 rounded-md text-sm font-medium hover:bg-[#8fc2c7] transition-colors"
                >
                  Manage Documents
                </button>
                <button 
                  onClick={handleTaxCalculator}
                  className="w-full bg-[#E5E9C5] text-[#016B61] py-2 px-4 rounded-md text-sm font-medium hover:bg-[#d4d8b5] transition-colors"
                >
                  Tax Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#E5E9C5] sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-[#70B2B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                      Upload Document
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Select a document to upload for your tax filing.
                      </p>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Document Type</label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[#9ECFD4] focus:outline-none focus:ring-[#70B2B2] focus:border-[#70B2B2] sm:text-sm rounded-md border">
                          <option>Form 16</option>
                          <option>Bank Statement</option>
                          <option>Investment Proof</option>
                          <option>Rent Receipt</option>
                          <option>Home Loan Statement</option>
                        </select>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Upload File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#9ECFD4] border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#70B2B2] hover:text-[#5fa3a3] focus-within:outline-none">
                                <span>Upload a file</span>
                                <input type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#E5E9C5] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md bg-[#70B2B2] text-white px-4 py-2 text-base font-medium hover:bg-[#5fa3a3] sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  Upload
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md bg-white text-[#70B2B2] border border-[#70B2B2] px-4 py-2 text-base font-medium hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUploadModal(false)}
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

export default UserDashboard;