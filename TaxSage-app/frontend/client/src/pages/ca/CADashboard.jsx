import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

const CADashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingRequests: 0,
    pendingReviews: 0,
    completedFilings: 0,
    revenue: 0
  });

  const [recentClients, setRecentClients] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);

  useEffect(() => {
    loadClientRequests();
    // Mock data
    setStats({
      totalClients: 24,
      pendingRequests: 3,
      pendingReviews: 8,
      completedFilings: 16,
      revenue: 184000
    });

    setRecentClients([
      {
        id: 1,
        name: 'Kashvi Thakkar',
        email: 'kashvithakkar16@email.com',
        pan: 'ABCDE1234F',
        status: 'pending_review',
        lastFiling: '2024-03-15'
      },
      {
        id: 2,
        name: 'Kanishka Sinyal',
        email: 'kanishkasiyal@email.com',
        pan: 'FGHIJ5678K',
        status: 'approved',
        lastFiling: '2024-03-12'
      }
    ]);

    setPendingReviews([
      {
        id: 1,
        clientName: 'Kashvi Thakkar',
        pan: 'ABCDE1234F',
        submittedDate: '2024-03-15',
        priority: 'high',
        filingId: 'filing_001'
      }
    ]);
  }, []);

  const loadClientRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem('caRequests') || '[]');
    const myRequests = storedRequests.filter(req => req.caId === 1);
    setClientRequests(myRequests);
  };

  const handleReviewFiling = (filingId) => {
    navigate(`/ca/review/${filingId}`);
  };

  const handleViewClient = (clientId) => {
    navigate('/ca/clients');
  };

  const handleViewAllClients = () => {
    navigate('/ca/clients');
  };

  const handleViewProfile = () => {
    navigate('/ca/profile');
  };

  const handleGenerateReport = () => {
    navigate('/ca/reports');
  };

  const handleViewRequests = () => {
    navigate('/ca/requests');
  };

  const handleManageClients = () => {
    navigate('/ca/clients');
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'bg-[#98c1d9] text-[#293241] border-[#98c1d9]';
      case 'approved': return 'bg-[#293241] text-white border-[#293241]';
      case 'action_required': return 'bg-[#ee6c4d] text-white border-[#ee6c4d]';
      case 'pending': return 'bg-[#98c1d9] text-[#293241] border-[#98c1d9]';
      case 'accepted': return 'bg-[#293241] text-white border-[#293241]';
      case 'rejected': return 'bg-[#ee6c4d] text-white border-[#ee6c4d]';
      default: return 'bg-[#e0fbfc] text-[#293241] border-[#98c1d9]';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-[#ee6c4d] text-white';
      case 'high': return 'bg-[#ee6c4d] text-white';
      case 'medium': return 'bg-[#98c1d9] text-[#293241]';
      case 'low': return 'bg-[#e0fbfc] text-[#293241]';
      default: return 'bg-[#e0fbfc] text-[#293241]';
    }
  };

  const pendingRequests = clientRequests.filter(req => req.status === 'pending');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#3d5a80] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">CA</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#293241]">CA Dashboard</h1>
                <p className="text-[#3d5a80] text-sm">Welcome back, {user?.name || 'CA'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleViewProfile}
                className="flex items-center space-x-2 text-[#3d5a80] hover:text-[#293241] transition-colors px-3 py-2 rounded-lg hover:bg-[#e0fbfc]"
              >
                <div className="w-8 h-8 bg-[#3d5a80] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'CA'}
                </div>
                <span>Profile</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="text-[#3d5a80] hover:text-[#ee6c4d] transition-colors px-3 py-2 rounded-lg hover:bg-[#e0fbfc]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', action: null },
              { id: 'requests', label: 'Requests', action: handleViewRequests },
              { id: 'clients', label: 'Clients', action: handleViewAllClients },
              { id: 'reviews', label: 'Reviews', action: () => pendingReviews.length > 0 && navigate(`/ca/review/${pendingReviews[0].filingId}`) },
              { id: 'reports', label: 'Reports', action: handleGenerateReport }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#3d5a80] text-[#3d5a80]'
                    : 'border-transparent text-[#3d5a80] hover:text-[#293241] hover:border-[#98c1d9]'
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.action) tab.action();
                }}
                disabled={tab.id === 'reviews' && pendingReviews.length === 0}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {[
            { 
              title: 'Total Clients', 
              value: stats.totalClients, 
              icon: '👥',
              bgColor: 'bg-[#e0fbfc]',
              borderColor: 'border-[#98c1d9]',
              textColor: 'text-[#3d5a80]'
            },
            { 
              title: 'Pending Requests', 
              value: stats.pendingRequests, 
              icon: '📨',
              bgColor: 'bg-[#98c1d9]',
              borderColor: 'border-[#3d5a80]',
              textColor: 'text-[#293241]'
            },
            { 
              title: 'Pending Reviews', 
              value: stats.pendingReviews, 
              icon: '📋',
              bgColor: 'bg-[#3d5a80]',
              borderColor: 'border-[#293241]',
              textColor: 'text-white'
            },
            { 
              title: 'Completed Filings', 
              value: stats.completedFilings, 
              icon: '✅',
              bgColor: 'bg-[#293241]',
              borderColor: 'border-[#293241]',
              textColor: 'text-white'
            },
            { 
              title: 'Revenue', 
              value: `₹${stats.revenue.toLocaleString()}`, 
              icon: '💰',
              bgColor: 'bg-[#ee6c4d]',
              borderColor: 'border-[#ee6c4d]',
              textColor: 'text-white'
            },
          ].map((stat, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-sm p-6 border ${stat.borderColor} hover:shadow-md transition-shadow`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3 ${stat.textColor}`}>
                  <span className="text-xl">{stat.icon}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Client Requests */}
          <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9]">
            <div className="px-6 py-5 border-b border-[#98c1d9]">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#293241]">Client Requests</h3>
                <span className="text-sm text-[#3d5a80]">{pendingRequests.length} pending</span>
              </div>
            </div>
            <div className="p-6">
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="border border-[#98c1d9] rounded-lg p-4 hover:bg-[#e0fbfc] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-[#293241]">{request.clientName}</h4>
                          <p className="text-[#3d5a80] text-sm">{request.clientEmail}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-[#3d5a80] mb-1">
                          <span className="font-medium">Service:</span> {request.serviceType}
                        </p>
                        <p className="text-sm text-[#3d5a80] line-clamp-2">
                          {request.message}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-[#3d5a80] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#2d4566] transition-colors">
                          Accept
                        </button>
                        <button className="flex-1 border border-[#ee6c4d] text-[#ee6c4d] py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#e0fbfc] transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingRequests.length > 3 && (
                    <button 
                      onClick={handleViewRequests}
                      className="w-full text-center text-[#3d5a80] hover:text-[#293241] font-medium py-2 transition-colors"
                    >
                      View All Requests ({pendingRequests.length})
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-[#e0fbfc] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-[#3d5a80]">📨</span>
                  </div>
                  <p className="text-[#3d5a80] font-medium">No pending requests</p>
                  <p className="text-[#98c1d9] text-sm mt-1">New client requests will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9]">
            <div className="px-6 py-5 border-b border-[#98c1d9]">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#293241]">Pending Reviews</h3>
                <span className="text-sm text-[#3d5a80]">{pendingReviews.length} items</span>
              </div>
            </div>
            <div className="p-6">
              {pendingReviews.length > 0 ? (
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 border border-[#98c1d9] rounded-lg hover:bg-[#e0fbfc] transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-[#3d5a80] rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {review.clientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#293241]">{review.clientName}</p>
                          <p className="text-sm text-[#3d5a80]">PAN: {review.pan}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleReviewFiling(review.filingId)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#3d5a80] hover:bg-[#2d4566] transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-[#e0fbfc] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-[#3d5a80]">📋</span>
                  </div>
                  <p className="text-[#3d5a80] font-medium">No pending reviews</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-[#98c1d9]">
          <div className="px-6 py-5 border-b border-[#98c1d9]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#293241]">Recent Clients</h3>
              <button 
                onClick={handleViewAllClients}
                className="text-sm text-[#3d5a80] hover:text-[#293241] font-medium transition-colors"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentClients.length > 0 ? (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border border-[#98c1d9] rounded-lg hover:bg-[#e0fbfc] transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#3d5a80] rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#293241]">{client.name}</p>
                        <p className="text-sm text-[#3d5a80]">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 border ${getStatusColor(client.status)}`}>
                        {client.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => handleViewClient(client.id)}
                        className="inline-flex items-center px-4 py-2 border border-[#98c1d9] text-sm font-medium rounded-lg text-[#3d5a80] bg-white hover:bg-[#e0fbfc] transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-[#e0fbfc] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-[#3d5a80]">👥</span>
                </div>
                <p className="text-[#3d5a80] font-medium">No clients assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-[#98c1d9]">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-[#293241] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button 
                onClick={handleViewRequests}
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-[#3d5a80] hover:bg-[#2d4566] transition-colors"
              >
                <span className="mr-3 text-lg">📨</span>
                View Requests
              </button>
              <button 
                onClick={handleGenerateReport}
                className="inline-flex items-center justify-center px-6 py-4 border border-[#98c1d9] text-base font-medium rounded-lg text-[#3d5a80] bg-white hover:bg-[#e0fbfc] transition-colors"
              >
                <span className="mr-3 text-lg">📊</span>
                Generate Report
              </button>
              <button 
                onClick={handleManageClients}
                className="inline-flex items-center justify-center px-6 py-4 border border-[#98c1d9] text-base font-medium rounded-lg text-[#3d5a80] bg-white hover:bg-[#e0fbfc] transition-colors"
              >
                <span className="mr-3 text-lg">👥</span>
                Manage Clients
              </button>
              <button 
                onClick={handleViewProfile}
                className="inline-flex items-center justify-center px-6 py-4 border border-[#98c1d9] text-base font-medium rounded-lg text-[#3d5a80] bg-white hover:bg-[#e0fbfc] transition-colors"
              >
                <span className="mr-3 text-lg">👤</span>
                My Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CADashboard;