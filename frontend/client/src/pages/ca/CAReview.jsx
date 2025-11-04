import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CAReview = () => {
  const navigate = useNavigate();
  const { filingId } = useParams();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [comments, setComments] = useState('');

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setReviewData({
        id: filingId || '1',
        filingType: 'ITR-1',
        assessmentYear: '2024-25',
        priority: 'high',
        status: 'pending_review',
        clientName: 'Rajesh Kumar',
        pan: 'ABCDE1234F',
        email: 'rajesh@email.com',
        phone: '+91 9876543210',
        submittedDate: '2024-03-15',
        dueDate: '2024-07-31',
        incomeDetails: {
          salary: 1200000,
          business: 0,
          capitalGains: 50000,
          otherSources: 25000
        },
        deductions: {
          section80C: 150000,
          section80D: 25000,
          section24: 200000,
          other: 0
        },
        taxComputation: {
          totalIncome: 1275000,
          totalDeductions: 375000,
          taxableIncome: 900000,
          taxLiability: 112500,
          taxPaid: 100000,
          balanceTax: 12500
        },
        documents: [
          { id: 1, name: 'Form-16.pdf', uploadedDate: '2024-03-15' },
          { id: 2, name: 'Investment_Proofs.pdf', uploadedDate: '2024-03-15' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [filingId]);

  const handleApproveFiling = () => {
    if (!comments.trim()) {
      alert('Please add review comments before approving the filing.');
      return;
    }

    if (window.confirm('Are you sure you want to approve this filing? This action will notify the client.')) {
      // Update filing status
      const updatedFiling = {
        ...reviewData,
        status: 'approved',
        reviewComments: comments,
        reviewedDate: new Date().toISOString()
      };

      // Save to localStorage or send to backend
      const filings = JSON.parse(localStorage.getItem('caFilings') || '[]');
      const updatedFilings = filings.map(f => 
        f.id === reviewData.id ? updatedFiling : f
      );
      localStorage.setItem('caFilings', JSON.stringify(updatedFilings));

      alert('Filing approved successfully! Client has been notified.');
      navigate('/ca/dashboard');
    }
  };

  const handleRequestChanges = () => {
    if (!comments.trim()) {
      alert('Please add comments explaining what changes are needed.');
      return;
    }

    if (window.confirm('Request changes from the client? They will be notified with your comments.')) {
      // Update filing status
      const updatedFiling = {
        ...reviewData,
        status: 'changes_requested',
        reviewComments: comments,
        reviewedDate: new Date().toISOString()
      };

      // Save to localStorage or send to backend
      const filings = JSON.parse(localStorage.getItem('caFilings') || '[]');
      const updatedFilings = filings.map(f => 
        f.id === reviewData.id ? updatedFiling : f
      );
      localStorage.setItem('caFilings', JSON.stringify(updatedFilings));

      alert('Change request sent to client successfully!');
      navigate('/ca/dashboard');
    }
  };

  const handleViewDocument = (doc) => {
    alert(`Viewing document: ${doc.name}\n\nIn a real application, this would open the PDF viewer.`);
  };

  const handleDownloadDocument = (doc) => {
    alert(`Downloading: ${doc.name}\n\nIn a real application, this would download the file.`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-[#ee6c4d] text-white border-[#ee6c4d]';
      case 'medium': return 'bg-[#98c1d9] text-[#293241] border-[#98c1d9]';
      case 'low': return 'bg-[#e0fbfc] text-[#293241] border-[#98c1d9]';
      default: return 'bg-[#e0fbfc] text-[#293241] border-[#98c1d9]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3d5a80] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3d5a80]">Loading filing details...</p>
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-[#e0fbfc] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#3d5a80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-[#3d5a80] font-medium text-lg">Filing Not Found</p>
          <p className="text-[#98c1d9] text-sm mt-2">The requested filing could not be found.</p>
          <button
            onClick={() => navigate('/ca/dashboard')}
            className="mt-4 bg-[#3d5a80] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d4566] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      {/* Header */}
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
                <h1 className="text-xl font-semibold text-[#293241]">Review Filing</h1>
                <p className="text-[#3d5a80] text-sm">
                  {reviewData.filingType} - {reviewData.assessmentYear}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 border ${getPriorityColor(reviewData.priority)}`}>
                {reviewData.priority} priority
              </span>
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 bg-[#98c1d9] text-[#293241] border-[#98c1d9]">
                {reviewData.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Client Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#293241]">Client Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#3d5a80]">Client Name</p>
                  <p className="font-semibold text-[#293241]">{reviewData.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#3d5a80]">PAN Number</p>
                  <p className="font-mono font-semibold text-[#293241]">{reviewData.pan}</p>
                </div>
                <div>
                  <p className="text-sm text-[#3d5a80]">Email</p>
                  <p className="font-semibold text-[#293241]">{reviewData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#3d5a80]">Phone</p>
                  <p className="font-semibold text-[#293241]">{reviewData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-[#3d5a80]">Submitted Date</p>
                  <p className="font-semibold text-[#293241]">
                    {new Date(reviewData.submittedDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#3d5a80]">Due Date</p>
                  <p className="font-semibold text-[#293241]">
                    {new Date(reviewData.dueDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9]">
              <div className="border-b border-[#98c1d9]">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'calculations', label: 'Tax Calculations' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#3d5a80] text-[#3d5a80]'
                          : 'border-transparent text-[#3d5a80] hover:text-[#293241] hover:border-[#98c1d9]'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#e0fbfc] rounded-lg p-4">
                        <h4 className="font-semibold text-[#293241] mb-3">Income Details</h4>
                        {Object.entries(reviewData.incomeDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-[#98c1d9] last:border-b-0">
                            <span className="text-sm text-[#3d5a80] capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-semibold text-[#293241]">
                              ₹{value.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#e0fbfc] rounded-lg p-4">
                        <h4 className="font-semibold text-[#293241] mb-3">Deductions</h4>
                        {Object.entries(reviewData.deductions).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-[#98c1d9] last:border-b-0">
                            <span className="text-sm text-[#3d5a80] capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-semibold text-[#293241]">
                              ₹{value.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#293241] mb-4">Uploaded Documents</h3>
                    {reviewData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-[#98c1d9] rounded-lg hover:bg-[#e0fbfc] transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-[#ee6c4d] rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">PDF</span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#293241]">{doc.name}</p>
                            <p className="text-sm text-[#3d5a80]">
                              Uploaded: {new Date(doc.uploadedDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDocument(doc)}
                            className="px-4 py-2 border border-[#98c1d9] text-[#3d5a80] rounded-lg text-sm font-medium hover:bg-[#e0fbfc] transition-colors"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDownloadDocument(doc)}
                            className="px-4 py-2 border border-[#3d5a80] text-[#3d5a80] rounded-lg text-sm font-medium hover:bg-[#e0fbfc] transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Calculations Tab */}
                {activeTab === 'calculations' && (
                  <div className="space-y-6">
                    <div className="bg-[#e0fbfc] rounded-lg p-6">
                      <h4 className="font-semibold text-[#293241] mb-4">Tax Computation</h4>
                      {Object.entries(reviewData.taxComputation).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-[#98c1d9] last:border-b-0">
                          <span className="text-sm text-[#3d5a80] capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className={`font-semibold ${
                            key === 'balanceTax' && value > 0 ? 'text-[#ee6c4d]' : 'text-[#293241]'
                          }`}>
                            ₹{value.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Review Actions */}
          <div className="space-y-6">
            {/* Review Comments */}
            <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
              <h3 className="font-semibold text-[#293241] mb-4">Review Comments</h3>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your review comments, observations, or required changes..."
                rows="6"
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
              <h3 className="font-semibold text-[#293241] mb-4">Review Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleApproveFiling}
                  className="w-full bg-[#3d5a80] text-white py-3 rounded-lg font-medium hover:bg-[#2d4566] transition-colors"
                >
                  ✅ Approve Filing
                </button>
                <button 
                  onClick={handleRequestChanges}
                  className="w-full bg-[#98c1d9] text-[#293241] py-3 rounded-lg font-medium hover:bg-[#89b4cc] transition-colors"
                >
                  📝 Request Changes
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
              <h3 className="font-semibold text-[#293241] mb-4">Filing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#3d5a80]">Days until due:</span>
                  <span className="font-semibold text-[#293241]">
                    {Math.ceil((new Date(reviewData.dueDate) - new Date()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3d5a80]">Documents:</span>
                  <span className="font-semibold text-[#293241]">{reviewData.documents.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAReview;