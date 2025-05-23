import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import News from "./pages/News";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import AdvocacySettings from "./pages/AdvocacySettings";
import Analytics from "./pages/Analytics";
import Tutorial from "./pages/Tutorial";
import ChannelFeed from "./pages/ChannelFeed";
import ColleaguesFeed from "./pages/ColleaguesFeed";
import { EditorProvider } from "./context/EditorContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useNotifications } from "./context/NotificationContext";
import MainLayout from "./components/layouts/MainLayout";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Login from "./pages/Login";
import WorkspaceConfig from "./pages/WorkspaceConfig";

function AppContent() {
  const { markAsRead } = useNotifications();
  const { isLoading, isAuthenticated, socialHubUser, workSpaceNotCreated } = useAuth();

  useEffect(() => {
    const path = window.location.pathname.substring(1) || "news";
    markAsRead(path);
  }, [window.location.pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/advocacy/login" replace />;
  }

  // New workspace redirect logic
  if (isAuthenticated && socialHubUser?.role === "ADMIN" && workSpaceNotCreated) {
    return <WorkspaceConfig />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/news" replace />} />
        <Route path="/news" element={<News />} />
        <Route path="/news_feeds/:channelId" element={<News />} />
        <Route path="/colleagues" element={<ColleaguesFeed />} />
        <Route path="/channels/:section" element={<ChannelFeed />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/advocacy-settings" element={<AdvocacySettings />} />
        <Route path="/help" element={<Tutorial />} />
      </Routes>
    </MainLayout>
  );
}

const ProtectedLoginRoute = () => {
  const { isAuthenticated, isLoading, processLinkedInToken } = useAuth();
  const isDevelopment = import.meta.env.VITE_ENVIORNMENT === "development";
  const location = useLocation();
  const [processingToken, setProcessingToken] = useState(false);

  // Check if we have an access_token in the URL hash (from LinkedIn redirect)
  const hashParams = new URLSearchParams(location.hash.replace('#', ''));
  const accessToken = hashParams.get('access_token');

  useEffect(() => {
    const handleToken = async () => {
      if (accessToken && !isAuthenticated && !processingToken) {
        setProcessingToken(true);
        await processLinkedInToken(accessToken);
      }
    };

    handleToken();
  }, [accessToken, isAuthenticated, processLinkedInToken]);

  if (isLoading || processingToken) {
    return <LoadingScreen />;
  }

  // If user is authenticated, redirect to news
  if (isAuthenticated) {
    return <Navigate to="/news" replace />;
  }

  // If we have an access token but not authenticated yet, show loading
  if (accessToken) {
    return <LoadingScreen />;
  }

  return isDevelopment ? <Login /> : <Login />;
  // return isDevelopment ? <LoginPage /> : <Login />;

};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <EditorProvider>
            <Routes>
              {/* <Route path="/loading" element={<LoadingScreen />} /> */}
              <Route path="/advocacy/login" element={<ProtectedLoginRoute />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppContent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </EditorProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
