import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [unreadCounts, setUnreadCounts] = useState(() => {
    const saved = localStorage.getItem('unreadCounts');
    return saved ? JSON.parse(saved) : {
      'news-company-news': 3,
      'news-colleagues': 2,
      'channels-sales': 1,
      'channels-marketing': 2,
      'channels-feedback': 1,
    };
  });

  useEffect(() => {
    localStorage.setItem('unreadCounts', JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  const markAsRead = (section) => {
    setUnreadCounts(prev => ({
      ...prev,
      [section]: 0,
    }));
  };

  const addNewPost = (section) => {
    setUnreadCounts(prev => ({
      ...prev,
      [section]: (prev[section] || 0) + 1,
    }));
  };

  return (
    <NotificationContext.Provider value={{ unreadCounts, markAsRead, addNewPost }}>
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