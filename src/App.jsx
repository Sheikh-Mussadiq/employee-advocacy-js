// import React, { useState, useEffect } from 'react';
// import { Menu, X } from 'lucide-react';
// import Sidebar from './components/Sidebar';
// import News from './components/News';
// import Leaderboard from './components/Leaderboard';
// import Settings from './components/Settings';
// import Analytics from './components/Analytics';
// import Tutorial from './components/Tutorial';
// import ChannelFeed from './components/channels/ChannelFeed';
// import ColleaguesFeed from './components/ColleaguesFeed';
// import FloatingSearch from './components/FloatingSearch';
// import { EditorProvider } from './context/EditorContext';
// import { NotificationProvider } from './context/NotificationContext';
// import { useNotifications } from './context/NotificationContext';
// import { fetchRSSFeed } from './utils/rss';

// const DEFAULT_FEED_URL = 'https://rss.app/feeds/_LCPPWMOryLvwQgZW.xml';

// function AppContent() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('news');
//   const [feed, setFeed] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { markAsRead } = useNotifications();

//   useEffect(() => {
//     markAsRead(activeTab);
//   }, [activeTab]);

//   useEffect(() => {
//     // Load the default RSS feed when the component mounts
//     fetchRSSFeed(DEFAULT_FEED_URL, setFeed, setIsLoading, setError);
//   }, []);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   const renderContent = () => {
//     if (activeTab === 'news') {
//       return (
//         <News 
//           feed={feed} 
//           setFeed={setFeed} 
//           isLoading={isLoading} 
//           error={error}
//           title="Company News"
//           description="Latest updates and announcements from the company"
//         />
//       );
//     }

//     if (activeTab.startsWith('channels-')) {
//       const channelSection = activeTab.replace('channels-', '');
//       let title = '';
//       let description = '';

//       switch (channelSection) {
//         case 'sales':
//           title = 'Sales Channel';
//           description = 'Content inspiration and best practices for sales professionals';
//           break;
//         case 'marketing':
//           title = 'Marketing Channel';
//           description = 'Content inspiration and best practices for marketing professionals';
//           break;
//         case 'hr':
//           title = 'HR Channel';
//           description = 'Share open positions and career opportunities with your network';
//           break;
//         case 'feedback':
//           title = 'Ask for Feedback';
//           description = 'Share your content and get feedback from your colleagues';
//           break;
//       }

//       return (
//         <div>
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
//             <p className="text-gray-600 mt-1">{description}</p>
//           </div>
//           <ChannelFeed channelName={channelSection} />
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case 'help':
//         return <Tutorial />;
//       case 'leaderboard':
//         return <Leaderboard />;
//       case 'analytics':
//         return <Analytics />;
//       case 'colleagues':
//         return (
//           <div>
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Colleagues</h2>
//               <p className="text-gray-600 mt-1">Support your colleagues' posts with a like or a comment</p>
//             </div>
//             <ColleaguesFeed />
//           </div>
//         );
//       case 'settings':
//         return (
//           <Settings
//             setFeed={setFeed}
//             setIsLoading={setIsLoading}
//             setError={setError}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <button
//         onClick={toggleMenu}
//         className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg"
//       >
//         {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>

//       <Sidebar
//         isOpen={isMenuOpen}
//         onClose={() => setIsMenuOpen(false)}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//       />

//       <main className="flex-1 px-4 pt-20 md:pt-6 pb-6 md:pl-72">
//         <div className="max-w-5xl mx-auto">
//           {renderContent()}
//         </div>
//       </main>

//       <FloatingSearch setActiveTab={setActiveTab} />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <NotificationProvider>
//       <EditorProvider>
//         <AppContent />
//       </EditorProvider>
//     </NotificationProvider>
//   );
// }

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
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
    <div className="min-h-screen bg-gray-50 flex">
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigate={navigate}
        currentPath={location.pathname}
      />

      <main className="flex-1 px-4 pt-20 md:pt-6 pb-6 md:pl-72">
        <div className="max-w-5xl mx-auto">
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
             <Route path="*" element={
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