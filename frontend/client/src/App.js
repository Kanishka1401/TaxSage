import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx';
import RequireAuth from './components/RequireAuth';

// Import User Pages
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/user/UserDashboard.jsx';
import TaxFilingPage from './pages/user/TaxFilingPage.jsx';
import TaxCalculator from './pages/user/TaxCalculator.jsx';
import Documents from './pages/user/Documents.jsx';
import FindCA from './pages/user/FindCA.jsx';
import HelpGuide from './pages/user/HelpGuide.jsx';

// Import CA Pages
import CADashboard from './pages/ca/CADashboard.jsx';
import CAClients from './pages/ca/CAClients.jsx';
import CAReview from './pages/ca/CAReview.jsx';
import CAProfile from './pages/ca/CAProfile.jsx';
import CAReports from './pages/ca/CAReports.jsx';
import CARequests from './pages/ca/CARequests.jsx';

// Import Route Protection
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CAProtectedRoute from './components/CAProtectedRoute.jsx';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* User Protected Routes */}
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

          {/* CA Protected Routes */}
          <Route 
            path="/ca/dashboard" 
            element={
              <CAProtectedRoute>
                <CADashboard />
              </CAProtectedRoute>
            } 
          />
          <Route 
            path="/ca/clients" 
            element={
              <CAProtectedRoute>
                <CAClients />
              </CAProtectedRoute>
            } 
          />
          <Route 
            path="/ca/review/:filingId" 
            element={
              <CAProtectedRoute>
                <CAReview />
              </CAProtectedRoute>
            } 
          />
          <Route 
            path="/ca/profile" 
            element={
              <CAProtectedRoute>
                <CAProfile />
              </CAProtectedRoute>
            } 
          />
          <Route 
            path="/ca/reports" 
            element={
              <CAProtectedRoute>
                <CAReports />
              </CAProtectedRoute>
            } 
          />
          <Route 
            path="/ca/requests" 
            element={
              <CAProtectedRoute>
                <CARequests />
              </CAProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;