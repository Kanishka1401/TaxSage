import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';

// Icon Components
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const Form16Icon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BankIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const InvestmentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const OtherIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const Documents = () => {
  const navigate = useNavigate();
  const { documents, addDocument, deleteDocument } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Form16', 'Bank', 'Investments', 'Other'];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setIsUploading(true);
      
      setTimeout(() => {
        const newDoc = {
          id: Date.now(),
          name: file.name,
          type: getFileType(file),
          size: formatFileSize(file.size),
          date: new Date().toLocaleDateString('en-IN'),
          category: getCategoryFromName(file.name),
          uploadDate: new Date().toISOString()
        };
        
        addDocument(newDoc);
        setIsUploading(false);
        alert('✅ Document uploaded successfully!');
        event.target.value = '';
      }, 1500);
    }
  };

  const getFileType = (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension)) return 'PDF';
    if (['jpg', 'jpeg', 'png'].includes(extension)) return 'Image';
    if (['doc', 'docx'].includes(extension)) return 'Word';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryFromName = (fileName) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('form16') || lowerName.includes('form-16')) {
      return 'Form16';
    } else if (lowerName.includes('bank') || lowerName.includes('statement')) {
      return 'Bank';
    } else if (lowerName.includes('investment') || lowerName.includes('proof') || lowerName.includes('80c')) {
      return 'Investments';
    } else {
      return 'Other';
    }
  };

  const handleViewDocument = (doc) => {
    alert(`📄 Viewing document: ${doc.name}\n\nType: ${doc.type}\nSize: ${doc.size}\nCategory: ${doc.category}\nUploaded: ${doc.date}\n\nIn a real application, this would open a document viewer.`);
  };

  const handleDownloadDocument = (doc) => {
    alert(`⬇️ Downloading: ${doc.name}\n\nThis would download the file to your device in a real application.`);
  };

  const handleDeleteDocument = (docId) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      deleteDocument(docId);
    }
  };

  const getDocumentsByCategory = (category) => {
    return documents.filter(doc => doc.category === category);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Form16': return <Form16Icon />;
      case 'Bank': return <BankIcon />;
      case 'Investments': return <InvestmentIcon />;
      default: return <OtherIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Form16': return 'bg-[#3d5a80] text-white';
      case 'Bank': return 'bg-[#98c1d9] text-[#293241]';
      case 'Investments': return 'bg-[#ee6c4d] text-white';
      default: return 'bg-[#e0fbfc] text-[#293241]';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-600 border-red-200';
      case 'Image': return 'bg-green-100 text-green-600 border-green-200';
      case 'Word': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => 
    new Date(b.uploadDate) - new Date(a.uploadDate)
  );

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
                <h1 className="text-xl font-semibold text-[#293241]">My Documents</h1>
                <p className="text-[#3d5a80] text-sm">Manage and organize your tax-related documents</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#293241] mb-2">My Documents</h1>
              <p className="text-[#3d5a80]">Manage and organize your tax-related documents</p>
            </div>
            <div className="mt-4 md:mt-0">
              <label className="bg-[#3d5a80] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors cursor-pointer inline-flex items-center space-x-2 shadow-sm">
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <span>Upload Document</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors bg-white"
                />
                <SearchIcon className="w-5 h-5 text-[#3d5a80] absolute left-3 top-3" />
              </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                    selectedCategory === category
                      ? 'bg-[#3d5a80] text-white border-[#3d5a80]'
                      : 'bg-[#e0fbfc] text-[#3d5a80] border-[#98c1d9] hover:bg-[#98c1d9] hover:text-[#293241]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Uploading Indicator */}
          {isUploading && (
            <div className="bg-[#e0fbfc] border border-[#98c1d9] rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-[#3d5a80] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#3d5a80]">Uploading document... Please wait</p>
              </div>
            </div>
          )}

          {/* Documents List */}
          {sortedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#e0fbfc] rounded-full flex items-center justify-center text-[#3d5a80] mx-auto mb-4">
                <DocumentIcon />
              </div>
              <h3 className="text-lg font-semibold text-[#293241] mb-2">
                {documents.length === 0 ? 'No documents yet' : 'No documents found'}
              </h3>
              <p className="text-[#3d5a80] mb-6">
                {documents.length === 0 
                  ? 'Upload your first document to get started with tax filing' 
                  : 'Try changing your search or filter criteria'
                }
              </p>
              {documents.length === 0 && (
                <label className="bg-[#3d5a80] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors cursor-pointer inline-flex items-center space-x-2">
                  <UploadIcon />
                  <span>Upload Your First Document</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm text-[#3d5a80] mb-2">
                <span>Showing {sortedDocuments.length} of {documents.length} documents</span>
                <span>Sorted by: Newest first</span>
              </div>
              
              {sortedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-[#98c1d9] rounded-lg hover:bg-[#e0fbfc] transition-colors group">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getFileTypeColor(doc.type)}`}>
                      <span className="font-semibold text-sm">{doc.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="font-medium text-[#293241] truncate">{doc.name}</p>
                        <span className={`px-2 py-1 rounded text-xs whitespace-nowrap border ${getCategoryColor(doc.category)}`}>
                          <span className="flex items-center space-x-1">
                            {getCategoryIcon(doc.category)}
                            <span>{doc.category}</span>
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-[#3d5a80]">
                        {doc.type} • {doc.size} • Uploaded on {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDocument(doc)}
                      className="text-[#3d5a80] hover:text-[#2d4566] p-2 rounded hover:bg-[#3d5a80] hover:bg-opacity-10 transition-colors"
                      title="View Document"
                    >
                      <ViewIcon />
                    </button>
                    <button 
                      onClick={() => handleDownloadDocument(doc)}
                      className="text-[#3d5a80] hover:text-[#2d4566] p-2 rounded hover:bg-[#3d5a80] hover:bg-opacity-10 transition-colors"
                      title="Download"
                    >
                      <DownloadIcon />
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-[#ee6c4d] hover:text-[#d45a3d] p-2 rounded hover:bg-[#ee6c4d] hover:bg-opacity-10 transition-colors"
                      title="Delete Document"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Summary */}
          {documents.length > 0 && (
            <div className="mt-8 border-t border-[#98c1d9] pt-6">
              <h3 className="text-lg font-semibold text-[#293241] mb-4">Document Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.filter(cat => cat !== 'All').map((category) => {
                  const categoryDocs = getDocumentsByCategory(category);
                  return (
                    <div key={category} className="bg-[#e0fbfc] p-4 rounded-lg text-center hover:shadow-md transition-shadow border border-[#98c1d9]">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center text-[#3d5a80]">
                        {getCategoryIcon(category)}
                      </div>
                      <p className="font-medium text-[#293241]">{category}</p>
                      <p className="text-sm text-[#3d5a80]">
                        {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Storage Info */}
          {documents.length > 0 && (
            <div className="mt-6 p-4 bg-[#e0fbfc] rounded-lg border border-[#98c1d9]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#3d5a80]">Total storage used: {documents.length} documents</span>
                <span className="text-[#3d5a80] font-medium">Unlimited storage</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;