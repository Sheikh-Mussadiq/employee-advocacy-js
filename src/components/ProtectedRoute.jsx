import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, processLinkedInToken } = useAuth();
  // const { isAuthenticated, isLoading } = useAuth();

  const location = useLocation();
  const [processingToken, setProcessingToken] = useState(false);

  // // Check if we have an access_token in the URL hash
  const hashParams = new URLSearchParams(location.hash.replace('#', ''));
  const accessToken = hashParams.get('access_token');

  useEffect(() => {
    const handleToken = async () => {
      if (accessToken && !isAuthenticated && !processingToken) {
        setProcessingToken(true);
        await processLinkedInToken(accessToken);
        setProcessingToken(false);
      }
    };

    handleToken();
  }, [accessToken, isAuthenticated, processLinkedInToken]);

  // Show loading screen while checking auth or processing token
  if (isLoading ) {
    return <LoadingScreen />;
  }

  // If user has a token but is not authenticated yet, continue showing loading
  if (accessToken && !isAuthenticated) {
    return <LoadingScreen />;
  }

  // If not authenticated and no token, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/advocacy/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}