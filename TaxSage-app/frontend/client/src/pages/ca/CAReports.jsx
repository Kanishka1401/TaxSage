import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CAReports = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('');

  const reports = [
    { id: 'client_list', name: 'Client List', description: 'Complete list of all clients' },
    { id: 'filing_status', name: 'Filing Status Report', description: 'Status of all tax filings' },
    { id: 'revenue', name: 'Revenue Report', description: 'Revenue analysis and trends' },
    { id: 'pending_reviews', name: 'Pending Reviews', description: 'All pending tax filing reviews' }
  ];

  const generateReport = () => {
    if (selectedReport) {
      alert(`Generating ${selectedReport} report...`);
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
                <h1 className="text-xl font-semibold text-[#293241]">Reports & Analytics</h1>
                <p className="text-[#3d5a80] text-sm">Generate professional reports</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-8">
          <h2 className="text-lg font-semibold text-[#293241] mb-6">Available Reports</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {reports.map(report => (
              <div 
                key={report.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedReport === report.id 
                    ? 'border-[#3d5a80] bg-[#e0fbfc]' 
                    : 'border-[#98c1d9] hover:border-[#3d5a80]'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <h3 className="font-semibold text-[#293241] mb-2">{report.name}</h3>
                <p className="text-[#3d5a80] text-sm">{report.description}</p>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={generateReport}
              disabled={!selectedReport}
              className="bg-[#3d5a80] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d4566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Report
            </button>
            <button className="border border-[#98c1d9] text-[#3d5a80] px-6 py-3 rounded-lg font-medium hover:bg-[#e0fbfc] transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAReports;