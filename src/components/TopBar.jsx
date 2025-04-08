import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, HelpCircle, Search, User, Menu, X } from 'lucide-react';
import NotificationsPanel from './notifications/NotificationsPanel';

export default function TopBar({ isMenuOpen, onMenuToggle }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/80 backdrop-blur-sm border-b border-design-greyOutlines"
    >
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-design-greyBG rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
          <h1 className="text-xl font-bold text-design-black">Employee Advocacy</h1>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-design-primaryGrey" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-design-greyBG border-0 rounded-lg focus:ring-2 focus:ring-button-primary-cta"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 hover:bg-design-greyBG rounded-lg transition-colors relative cursor-pointer"
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
            className="p-2 hover:bg-design-greyBG rounded-lg transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-design-primaryGrey" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 p-2 hover:bg-design-greyBG rounded-lg transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
            />
            <span className="text-sm font-medium text-design-black">John Doe</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}