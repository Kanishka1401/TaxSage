/**
 * API Configuration for Tax Filing Application
 * Contains all API endpoints and configuration settings
 */

// Base API URL - should be in environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Income Tax Department E-Filing Portal Configuration
export const ITR_API_CONFIG = {
  // Base URL for Income Tax E-Filing Portal
  baseUrl: process.env.REACT_APP_ITR_PORTAL_URL || 'https://eportal.incometax.gov.in/iec/foservices',
  
  // API Version
  version: 'v1',
  
  // Endpoints
  endpoints: {
    authenticate: '/authenticate',
    submitReturn: '/itrsubmission',
    getStatus: '/returnstatus',
    eVerify: '/evc',
    downloadAcknowledgment: '/itrv'
  },
  
  // ITR Form Types
  formTypes: {
    ITR1: 'ITR-1',
    ITR2: 'ITR-2',
    ITR3: 'ITR-3',
    ITR4: 'ITR-4'
  },
  
  // Assessment Years
  assessmentYears: [
    '2024-25',
    '2023-24',
    '2022-23'
  ],
  
  // Timeout settings (in milliseconds)
  timeout: 60000,
  
  // Retry configuration
  retryAttempts: 3,
  retryDelay: 2000
};

// Internal API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    verify: `${API_BASE_URL}/auth/verify`
  },
  
  // Tax Filing
  tax: {
    startFiling: `${API_BASE_URL}/tax/start-filing`,
    saveFiling: `${API_BASE_URL}/tax/filing`,
    getFiling: `${API_BASE_URL}/tax/filing`,
    submitFiling: `${API_BASE_URL}/tax/filing/submit`,
    inviteCA: (filingId) => `${API_BASE_URL}/tax/${filingId}/invite-ca`,
    saveITRJSON: `${API_BASE_URL}/tax/save-itr-json`,
    updateAcknowledgment: `${API_BASE_URL}/tax/filing/update-acknowledgment`
  },
  
  // E-Filing Integration
  efiling: {
    authenticate: `${API_BASE_URL}/tax/efiling/authenticate`,
    submit: `${API_BASE_URL}/tax/efiling/submit`,
    verify: `${API_BASE_URL}/tax/efiling/e-verify`,
    status: `${API_BASE_URL}/tax/efiling/status`,
    downloadITRV: `${API_BASE_URL}/tax/efiling/download-itrv`
  }
};

// HTTP Headers Configuration
export const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export default {
  ITR_API_CONFIG,
  API_ENDPOINTS,
  getHeaders
};


