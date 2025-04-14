import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import News from "./components/News";
import Leaderboard from "./components/Leaderboard";
import Settings from "./components/Settings";
import Analytics from "./components/Analytics";
import Tutorial from "./components/Tutorial";
import ChannelFeed from "./components/channels/ChannelFeed";
import ColleaguesFeed from "./components/ColleaguesFeed";
import FloatingSearch from "./components/FloatingSearch";
import TopContributors from "./components/news/TopContributors";
import CompanyNews from "./components/news/CompanyNews";
import { EditorProvider } from "./context/EditorContext";
import { NotificationProvider } from "./context/NotificationContext";
import { useNotifications } from "./context/NotificationContext";
import { fetchRSSFeed } from "./utils/rss";

export const DEFAULT_FEED_URL = "https://rss.app/feeds/_LCPPWMOryLvwQgZW.xml";

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.substring(1) || "news";
    markAsRead(path);
  }, [location.pathname]);

  useEffect(() => {
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

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="px-4 py-6">
              <Routes>
                <Route
                  path="/"
                  element={
                    <News
                      feed={feed}
                      setFeed={setFeed}
                      isLoading={isLoading}
                      error={error}
                      title="Company News"
                      description="Latest updates and announcements from the company"
                    />
                  }
                />
                <Route
                  path="/news"
                  element={
                    <News
                      feed={feed}
                      setFeed={setFeed}
                      isLoading={isLoading}
                      error={error}
                      title="Company News"
                      description="Latest updates and announcements from the company"
                    />
                  }
                />
                <Route path="/colleagues" element={<ColleaguesFeed />} />
                <Route path="/channels/:section" element={<ChannelFeed />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      setFeed={setFeed}
                      setIsLoading={setIsLoading}
                      setError={setError}
                    />
                  }
                />
                <Route path="/help" element={<Tutorial />} />
              </Routes>
            </div>
          </main>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block w-96 space-y-6 flex-shrink-0 px-6 py-6"
          >
            <TopContributors />
            <CompanyNews />
          </motion.div>
        </div>

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
