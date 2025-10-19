import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';

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
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setIsUploading(true);
      
      // Simulate upload process
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
        
        // Reset file input
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
      case 'Form16': return '📋';
      case 'Bank': return '🏦';
      case 'Investments': return '📈';
      default: return '📄';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-600';
      case 'Image': return 'bg-green-100 text-green-600';
      case 'Word': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Filter documents based on selected category and search term
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => 
    new Date(b.uploadDate) - new Date(a.uploadDate)
  );

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
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Documents</h1>
              <p className="text-gray-600">Manage and organize your tax-related documents</p>
            </div>
            <div className="mt-4 md:mt-0">
              <label className="bg-[#80A1BA] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6d8da4] transition-colors cursor-pointer inline-block shadow-sm">
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  '📁 Upload Document'
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#80A1BA] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Uploading Indicator */}
          {isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-700">Uploading document... Please wait</p>
              </div>
            </div>
          )}

          {/* Documents List */}
          {sortedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {documents.length === 0 ? 'No documents yet' : 'No documents found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {documents.length === 0 
                  ? 'Upload your first document to get started with tax filing' 
                  : 'Try changing your search or filter criteria'
                }
              </p>
              {documents.length === 0 && (
                <label className="bg-[#80A1BA] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6d8da4] transition-colors cursor-pointer inline-block">
                  Upload Your First Document
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
              <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>Showing {sortedDocuments.length} of {documents.length} documents</span>
                <span>Sorted by: Newest first</span>
              </div>
              
              {sortedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getFileTypeColor(doc.type)}`}>
                      <span className="font-semibold text-sm">{doc.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="font-medium text-gray-800 truncate">{doc.name}</p>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs whitespace-nowrap">
                          {getCategoryIcon(doc.category)} {doc.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {doc.type} • {doc.size} • Uploaded on {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDocument(doc)}
                      className="text-[#80A1BA] hover:text-[#6d8da4] font-medium text-sm p-2 rounded hover:bg-[#80A1BA] hover:bg-opacity-10 transition-colors"
                      title="View Document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDownloadDocument(doc)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm p-2 rounded hover:bg-green-50 transition-colors"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm p-2 rounded hover:bg-red-50 transition-colors"
                      title="Delete Document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Summary */}
          {documents.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.filter(cat => cat !== 'All').map((category) => {
                  const categoryDocs = getDocumentsByCategory(category);
                  return (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
                      <p className="font-medium text-gray-800">{category}</p>
                      <p className="text-sm text-gray-500">
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
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Total storage used: {documents.length} documents</span>
                <span className="text-blue-600">Unlimited storage</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;