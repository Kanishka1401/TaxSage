import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const CAProtectedRoute = ({ children }) => {
  const { user, userType } = useContext(AuthContext);
  
  // Debug logging
  console.log('CAProtectedRoute - User:', user);
  console.log('CAProtectedRoute - UserType:', userType);
  
  if (!user || userType !== 'ca') {
    console.log('Redirecting to login - User missing or not CA');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default CAProtectedRoute;