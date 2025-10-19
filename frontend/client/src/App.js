import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx'; // Add this import

// Import Pages
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import TaxFilingPage from './pages/TaxFilingPage.jsx';
import TaxCalculator from './pages/TaxCalculator.jsx';
import Documents from './pages/Documents.jsx';
import FindCA from './pages/FindCA.jsx';
import HelpGuide from './pages/HelpGuide.jsx';

// Import the ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <DataProvider> {/* Wrap everything with DataProvider */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tax-filing" 
            element={
              <ProtectedRoute>
                <TaxFilingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tax-calculator" 
            element={
              <ProtectedRoute>
                <TaxCalculator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/find-ca" 
            element={
              <ProtectedRoute>
                <FindCA />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/help-guide" 
            element={
              <ProtectedRoute>
                <HelpGuide />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;