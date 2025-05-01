import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, HelpCircle, Search, Menu, X } from 'lucide-react';
import NotificationsPanel from './notifications/NotificationsPanel';
import UserProfileSettings from './settings/UserProfileSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ isMenuOpen, onMenuToggle }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-design-white/80 backdrop-blur-sm border-b border-design-greyOutlines"
    >
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            className="p-2 hover:bg-design-greyBG rounded-lg transition-colors lg:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Center Section - Search */}
        <div className={`${isSearchOpen ? 'flex' : 'hidden'} flex-1 lg:flex max-w-2xl`}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-design-primaryGrey" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-design-greyBG border-0 rounded-lg focus:ring-2 focus:ring-button-primary-cta focus:outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Search Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-design-greyBG rounded-lg transition-colors lg:hidden"
          >
            <Search className="w-5 h-5 text-design-primaryGrey" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 hover:bg-design-greyBG rounded-lg transition-colors relative"
            ref={notificationsRef}
          >
            <Bell className="w-5 h-5 text-design-primaryGrey" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-semantic-error text-white text-xs flex items-center justify-center rounded-full">3</span>
            <NotificationsPanel 
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/help')}
            className="p-2 hover:bg-design-greyBG rounded-lg transition-colors hidden sm:flex"
          >
            <HelpCircle className="w-5 h-5 text-design-primaryGrey" />
          </motion.button>

          <motion.button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-2 hover:bg-design-greyBG rounded-lg transition-colors relative"
            ref={profileRef}
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
            />
            <span className="hidden sm:inline text-sm font-medium text-design-black">John Doe</span>
            {isProfileOpen && <UserProfileSettings onClose={() => setIsProfileOpen(false)} isAdmin={isAdmin} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}