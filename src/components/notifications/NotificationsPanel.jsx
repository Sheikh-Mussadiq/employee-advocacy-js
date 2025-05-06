import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, Heart, UserPlus, Star, X, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// Animation variants for notifications
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'comment',
    content: 'Sarah Chen commented on your post',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    icon: MessageSquare,
    color: 'text-button-primary-cta',
    bgColor: 'bg-semantic-info-light',
    link: '/colleagues'
  },
  {
    id: 2,
    type: 'like',
    content: 'Michael Rodriguez liked your post',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    icon: Heart,
    color: 'text-semantic-error-DEFAULT',
    bgColor: 'bg-semantic-error-light',
    link: '/colleagues'
  },
  {
    id: 3,
    type: 'follow',
    content: 'Emily Watson started following you',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    icon: UserPlus,
    color: 'text-semantic-success-DEFAULT',
    bgColor: 'bg-semantic-success-light',
    link: '/colleagues'
  },
  {
    id: 4,
    type: 'achievement',
    content: 'You earned the "Top Contributor" badge!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    icon: Star,
    color: 'text-semantic-warning-DEFAULT',
    bgColor: 'bg-semantic-warning-light',
    link: '/leaderboard'
  }
];

export default function NotificationsPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d');
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="absolute right-0 top-full mt-2 w-96 bg-design-white rounded-lg shadow-xl border border-design-greyOutlines overflow-hidden z-50"
      >
        <div className="p-4 border-b border-design-greyOutlines flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-design-primaryPurple" />
            <h3 className="font-semibold text-design-black">Notifications</h3>
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xs font-medium bg-semantic-error-DEFAULT text-white rounded-full px-2 py-0.5 flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-design-greyBG rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-design-primaryGrey" />
          </button>
        </div>
        
        <div className="flex border-b border-design-greyOutlines">
          <button 
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${filter === 'all' ? 'text-design-primaryPurple border-b-2 border-design-primaryPurple' : 'text-design-primaryGrey'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${filter === 'unread' ? 'text-design-primaryPurple border-b-2 border-design-primaryPurple' : 'text-design-primaryGrey'}`}
          >
            Unread
          </button>
          <button 
            onClick={() => setFilter('read')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${filter === 'read' ? 'text-design-primaryPurple border-b-2 border-design-primaryPurple' : 'text-design-primaryGrey'}`}
          >
            Read
          </button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="divide-y divide-design-greyOutlines max-h-[calc(100vh-250px)] overflow-y-auto"
        >
          {filteredNotifications.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="p-8 flex flex-col items-center justify-center text-center"
            >
              <Bell className="w-12 h-12 text-design-greyOutlines mb-2" />
              <p className="text-sm font-medium text-design-black mb-1">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
              <p className="text-xs text-design-primaryGrey">
                {filter === 'unread' ? 'You\'re all caught up!' : 'You\'ll see notifications here'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                whileHover={{ x: 3, backgroundColor: 'rgba(240, 238, 255, 0.5)' }}
                className={`p-4 transition-all duration-200 cursor-pointer ${
                  !notification.read ? 'bg-button-tertiary-fill/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${notification.bgColor}`}>
                    <notification.icon className={`w-4 h-4 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-medium text-design-black' : 'text-design-black'}`}>
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-design-primaryGrey" />
                      <p className="text-xs text-design-primaryGrey">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {!notification.read ? (
                      <div className="w-2 h-2 rounded-full bg-semantic-error-DEFAULT mr-1" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-semantic-success-DEFAULT opacity-50" />
                    )}
                    <ChevronRight className="w-4 h-4 text-design-primaryGrey ml-1" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="p-3 bg-design-greyBG border-t border-design-greyOutlines flex justify-between items-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`text-sm font-medium flex items-center gap-1 ${unreadCount > 0 ? 'text-button-primary-cta hover:text-button-primary-hover' : 'text-design-primaryGrey opacity-50 cursor-not-allowed'}`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark all as read</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm text-design-primaryPurple hover:text-button-primary-hover font-medium"
          >
            View all
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}