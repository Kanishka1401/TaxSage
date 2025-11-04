import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CAClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setClients([
        {
          id: 1,
          name: 'Rajesh Kumar',
          email: 'rajesh@email.com',
          pan: 'ABCDE1234F',
          status: 'pending_review',
          lastFiling: '2024-03-15'
        },
        {
          id: 2,
          name: 'Priya Sharma',
          email: 'priya@email.com',
          pan: 'FGHIJ5678K',
          status: 'approved',
          lastFiling: '2024-03-12'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'bg-[#98c1d9] text-[#293241] border-[#98c1d9]';
      case 'approved': return 'bg-[#293241] text-white border-[#293241]';
      case 'action_required': return 'bg-[#ee6c4d] text-white border-[#ee6c4d]';
      default: return 'bg-[#e0fbfc] text-[#293241] border-[#98c1d9]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3d5a80] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3d5a80]">Loading clients...</p>
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
                <h1 className="text-xl font-semibold text-[#293241]">Client Management</h1>
                <p className="text-[#3d5a80] text-sm">Manage your client relationships</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="action_required">Action Required</option>
            </select>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9]">
          <div className="px-6 py-5 border-b border-[#98c1d9]">
            <h3 className="text-lg font-semibold text-[#293241]">
              Clients ({filteredClients.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredClients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <div key={client.id} className="border border-[#98c1d9] rounded-lg p-6 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#3d5a80] rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#293241]">{client.name}</h3>
                          <p className="text-[#3d5a80] text-sm">{client.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 border ${getStatusColor(client.status)}`}>
                        {client.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm text-[#3d5a80] mb-6">
                      <div className="flex justify-between">
                        <span>PAN:</span>
                        <span className="font-mono text-[#293241]">{client.pan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Filing:</span>
                        <span className="text-[#293241]">{new Date(client.lastFiling).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 bg-[#3d5a80] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d4566] transition-colors">
                        View Profile
                      </button>
                      <button className="flex-1 border border-[#98c1d9] text-[#3d5a80] py-2.5 rounded-lg text-sm font-medium hover:bg-[#e0fbfc] transition-colors">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-[#e0fbfc] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#3d5a80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-[#3d5a80] font-medium text-lg">No clients found</p>
                <p className="text-[#98c1d9] text-sm mt-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria' 
                    : 'Your assigned clients will appear here.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CAClients;