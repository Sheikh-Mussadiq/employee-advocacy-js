import React from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, Heart, UserPlus, Star, X } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'comment',
    content: 'Sarah Chen commented on your post',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    icon: MessageSquare,
    color: 'text-blue-500',
    link: '/colleagues'
  },
  {
    id: 2,
    type: 'like',
    content: 'Michael Rodriguez liked your post',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    icon: Heart,
    color: 'text-red-500',
    link: '/colleagues'
  },
  {
    id: 3,
    type: 'follow',
    content: 'Emily Watson started following you',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    icon: UserPlus,
    color: 'text-green-500',
    link: '/colleagues'
  },
  {
    id: 4,
    type: 'achievement',
    content: 'You earned the "Top Contributor" badge!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    icon: Star,
    color: 'text-yellow-500',
    link: '/leaderboard'
  }
];

export default function NotificationsPanel({ isOpen, onClose }) {
  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return format(date, 'MMM d');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-gray-100 ${notification.color}`}>
                <notification.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                  {notification.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(notification.timestamp)}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
          Mark all as read
        </button>
      </div>
    </div>
  );
}