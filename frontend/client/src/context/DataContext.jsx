import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [taxFilings, setTaxFilings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFilings = localStorage.getItem('taxFilings');
    const savedDocuments = localStorage.getItem('documents');
    const savedPreferences = localStorage.getItem('userPreferences');

    if (savedFilings) setTaxFilings(JSON.parse(savedFilings));
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
    if (savedPreferences) setUserPreferences(JSON.parse(savedPreferences));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('taxFilings', JSON.stringify(taxFilings));
  }, [taxFilings]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Tax Filing Functions
  const addTaxFiling = (filingData) => {
    const newFiling = {
      id: Date.now(),
      ...filingData,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };
    setTaxFilings(prev => [newFiling, ...prev]);
    return newFiling;
  };

  const updateFilingStatus = (filingId, status) => {
    setTaxFilings(prev => 
      prev.map(filing => 
        filing.id === filingId ? { ...filing, status } : filing
      )
    );
  };

  // Document Functions
  const addDocument = (documentData) => {
    const newDoc = {
      id: Date.now(),
      ...documentData,
      uploadedAt: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const deleteDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const getDocument = (docId) => {
    return documents.find(doc => doc.id === docId);
  };

  const value = {
    // Tax Filings
    taxFilings,
    addTaxFiling,
    updateFilingStatus,
    
    // Documents
    documents,
    addDocument,
    deleteDocument,
    getDocument,
    
    // User Preferences
    userPreferences,
    setUserPreferences
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};