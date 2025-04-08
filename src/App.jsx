import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import News from './components/News';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import Tutorial from './components/Tutorial';
import ChannelFeed from './components/channels/ChannelFeed';
import ColleaguesFeed from './components/ColleaguesFeed';
import FloatingSearch from './components/FloatingSearch';
import { EditorProvider } from './context/EditorContext';
import { NotificationProvider } from './context/NotificationContext';
import { useNotifications } from './context/NotificationContext';
import { fetchRSSFeed } from './utils/rss';

export const DEFAULT_FEED_URL = 'https://rss.app/feeds/_LCPPWMOryLvwQgZW.xml';

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.substring(1) || 'news';
    markAsRead(path);
  }, [location.pathname]);

  useEffect(() => {
    // Load the default RSS feed when the component mounts
    fetchRSSFeed(DEFAULT_FEED_URL, setFeed, setIsLoading, setError);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isMenuOpen}
        onToggle={toggleMenu}
        onClose={() => setIsMenuOpen(false)}
        navigate={navigate}
        currentPath={location.pathname}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            <Routes>
              <Route path="/" element={
                <News 
                  feed={feed} 
                  setFeed={setFeed} 
                  isLoading={isLoading} 
                  error={error}
                  title="Company News"
                  description="Latest updates and announcements from the company"
                />
              } />
              <Route path="/news" element={
                <News 
                  feed={feed} 
                  setFeed={setFeed} 
                  isLoading={isLoading} 
                  error={error}
                  title="Company News"
                  description="Latest updates and announcements from the company"
                />
              } />
              <Route path="/colleagues" element={
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Colleagues</h2>
                    <p className="text-gray-600 mt-1">Support your colleagues' posts with a like or a comment</p>
                  </div>
                  <ColleaguesFeed />
                </div>
              } />
              <Route path="/channels/:section" element={<ChannelFeed />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={
                <Settings
                  setFeed={setFeed}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              } />
              <Route path="/help" element={<Tutorial />} />
            </Routes>
          </div>
        </main>

        <FloatingSearch navigate={navigate} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <NotificationProvider>
        <EditorProvider>
          <AppContent />
        </EditorProvider>
      </NotificationProvider>
    </Router>
  );
}