import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(undefined);

const INITIAL_COUNTS = {
  news: 5,
  colleagues: 3,
  'channels-sales': 4,
  'channels-marketing': 3,
  'channels-hr': 2,
  'channels-feedback': 3,
  leaderboard: 0,
  analytics: 0,
  settings: 0,
  help: 0
};

export function NotificationProvider({ children }) {
  const [unreadCounts, setUnreadCounts] = useState(INITIAL_COUNTS);

  const markAsRead = (path) => {
    if (!path) {
      // Handle root path as news
      setUnreadCounts(prev => ({
        ...prev,
        news: 0
      }));
      return;
    }

    // Remove leading slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    if (cleanPath.startsWith('channels')) {
      // Handle channel routes (e.g., "channels/sales" -> "channels-sales")
      const section = cleanPath.split('/')[1];
      setUnreadCounts(prev => ({
        ...prev,
        [`channels-${section}`]: 0
      }));
      return;
    }

    // Handle regular routes
    setUnreadCounts(prev => ({
      ...prev,
      [cleanPath]: 0,
    }));
  };

  const addNewPost = (section) => {
    setUnreadCounts(prev => ({
      ...prev,
      [section]: (prev[section] || 0) + 1,
    }));
  };

  const getChannelsCount = () => {
    return Object.entries(unreadCounts)
      .filter(([key]) => key.startsWith('channels-'))
      .reduce((sum, [_, count]) => sum + count, 0);
  };

  return (
    <NotificationContext.Provider value={{ 
      unreadCounts, 
      markAsRead, 
      addNewPost,
      getChannelsCount 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}