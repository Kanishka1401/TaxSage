import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CARequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem('caRequests') || '[]');
    setRequests(storedRequests);
  };

  const updateRequestStatus = (requestId, newStatus) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus, updatedAt: new Date().toISOString() }
        : request
    );
    
    setRequests(updatedRequests);
    localStorage.setItem('caRequests', JSON.stringify(updatedRequests));
    
    // Show success message
    const statusMessage = newStatus === 'accepted' ? 'accepted' : 
                         newStatus === 'rejected' ? 'rejected' : 'marked as complete';
    alert(`Request ${statusMessage} successfully!`);
  };

  const handleAcceptRequest = (requestId) => {
    if (window.confirm('Accept this request? The client will be notified.')) {
      updateRequestStatus(requestId, 'accepted');
    }
  };

  const handleRejectRequest = (requestId) => {
    if (window.confirm('Reject this request? The client will be notified.')) {
      updateRequestStatus(requestId, 'rejected');
    }
  };

  const handleMarkComplete = (requestId) => {
    if (window.confirm('Mark this request as completed?')) {
      updateRequestStatus(requestId, 'completed');
    }
  };

  const handleViewProfile = (request) => {
    setSelectedRequest(request);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setSelectedRequest(null);
    setShowProfileModal(false);
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#98c1d9] text-[#293241] border-[#98c1d9]';
      case 'accepted': return 'bg-[#293241] text-white border-[#293241]';
      case 'rejected': return 'bg-[#ee6c4d] text-white border-[#ee6c4d]';
      case 'completed': return 'bg-[#3d5a80] text-white border-[#3d5a80]';
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/ca/dashboard')}
                className="flex items-center text-[#3d5a80] hover:text-[#293241] transition-colors font-medium"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[#293241]">Client Requests</h1>
                <p className="text-[#3d5a80] text-sm">Manage incoming client requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-[#3d5a80] text-white' 
                  : 'bg-[#e0fbfc] text-[#3d5a80] hover:bg-[#98c1d9]'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-[#98c1d9] text-[#293241]' 
                  : 'bg-[#e0fbfc] text-[#3d5a80] hover:bg-[#98c1d9]'
              }`}
            >
              Pending ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'accepted' 
                  ? 'bg-[#293241] text-white' 
                  : 'bg-[#e0fbfc] text-[#3d5a80] hover:bg-[#98c1d9]'
              }`}
            >
              Accepted ({requests.filter(r => r.status === 'accepted').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed' 
                  ? 'bg-[#3d5a80] text-white' 
                  : 'bg-[#e0fbfc] text-[#3d5a80] hover:bg-[#98c1d9]'
              }`}
            >
              Completed ({requests.filter(r => r.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#293241]">{request.clientName}</h3>
                        <p className="text-[#3d5a80]">{request.clientEmail}</p>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-[#3d5a80]">Service Required</p>
                        <p className="font-semibold text-[#293241]">{request.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#3d5a80]">Requested On</p>
                        <p className="font-semibold text-[#293241]">
                          {new Date(request.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-[#3d5a80] mb-2">Client Message</p>
                      <p className="text-[#293241] bg-[#e0fbfc] p-3 rounded-lg">{request.message}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 lg:ml-6 lg:mt-0 mt-4 min-w-[180px]">
                    {request.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleAcceptRequest(request.id)}
                          className="bg-[#3d5a80] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2d4566] transition-colors"
                        >
                          Accept Request
                        </button>
                        <button 
                          onClick={() => handleRejectRequest(request.id)}
                          className="border border-[#ee6c4d] text-[#ee6c4d] py-2 px-4 rounded-lg font-medium hover:bg-[#fee5e0] transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === 'accepted' && (
                      <button 
                        onClick={() => handleMarkComplete(request.id)}
                        className="bg-[#3d5a80] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2d4566] transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewProfile(request)}
                      className="border border-[#98c1d9] text-[#3d5a80] py-2 px-4 rounded-lg font-medium hover:bg-[#e0fbfc] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#98c1d9]">
              <div className="bg-[#e0fbfc] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#3d5a80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[#3d5a80] font-medium text-lg">No requests found</p>
              <p className="text-[#98c1d9] text-sm mt-2">
                {filter === 'all' 
                  ? "You don't have any client requests yet." 
                  : `No ${filter} requests found.`
                }
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Request Details Modal */}
      {showProfileModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#98c1d9] sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#293241]">Request Details</h2>
                <button 
                  onClick={closeProfileModal}
                  className="text-[#3d5a80] hover:text-[#293241] transition-colors p-1 rounded-full hover:bg-[#e0fbfc]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#293241] mb-3">Client Information</h3>
                <div className="bg-[#e0fbfc] rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#3d5a80]">Name:</span>
                    <span className="font-medium text-[#293241]">{selectedRequest.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3d5a80]">Email:</span>
                    <span className="font-medium text-[#293241]">{selectedRequest.clientEmail}</span>
                  </div>
                  {selectedRequest.clientId && (
                    <div className="flex justify-between">
                      <span className="text-[#3d5a80]">Client ID:</span>
                      <span className="font-medium text-[#293241]">{selectedRequest.clientId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#293241] mb-3">Request Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#3d5a80]">Status:</span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 border ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3d5a80]">Priority:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedRequest.urgency)}`}>
                      {selectedRequest.urgency.charAt(0).toUpperCase() + selectedRequest.urgency.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3d5a80]">Service Type:</span>
                    <span className="font-medium text-[#293241]">{selectedRequest.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3d5a80]">Requested On:</span>
                    <span className="font-medium text-[#293241]">
                      {new Date(selectedRequest.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {selectedRequest.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-[#3d5a80]">Last Updated:</span>
                      <span className="font-medium text-[#293241]">
                        {new Date(selectedRequest.updatedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Message */}
              <div>
                <h3 className="text-lg font-semibold text-[#293241] mb-3">Client Message</h3>
                <div className="bg-[#e0fbfc] rounded-lg p-4">
                  <p className="text-[#293241] whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#98c1d9]">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => {
                        handleAcceptRequest(selectedRequest.id);
                        closeProfileModal();
                      }}
                      className="flex-1 bg-[#3d5a80] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors"
                    >
                      Accept Request
                    </button>
                    <button 
                      onClick={() => {
                        handleRejectRequest(selectedRequest.id);
                        closeProfileModal();
                      }}
                      className="flex-1 border border-[#ee6c4d] text-[#ee6c4d] py-3 rounded-lg font-semibold hover:bg-[#fee5e0] transition-colors"
                    >
                      Reject Request
                    </button>
                  </>
                )}
                {selectedRequest.status === 'accepted' && (
                  <button 
                    onClick={() => {
                      handleMarkComplete(selectedRequest.id);
                      closeProfileModal();
                    }}
                    className="flex-1 bg-[#3d5a80] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors"
                  >
                    Mark as Complete
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CARequests;