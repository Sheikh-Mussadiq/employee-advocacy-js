import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import News from "./pages/News";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
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

function AppContent() {
  const { markAsRead } = useNotifications();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    const path = window.location.pathname.substring(1) || "news";
    markAsRead(path);
  }, [window.location.pathname]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/loading" replace />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<News />} />
        <Route path="/news" element={<News />} />
        <Route path="/colleagues" element={<ColleaguesFeed />} />
        <Route path="/channels/:section" element={<ChannelFeed />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Tutorial />} />
      </Routes>
    </MainLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <EditorProvider>
            <Routes>
              <Route path="/loading" element={<LoadingScreen />} />
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