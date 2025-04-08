import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, History, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function FloatingSearch({ navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Mock search results - replace with actual search logic
    const mockResults = [
      {
        id: '1',
        type: 'news',
        title: 'Company Milestone Reached',
        description: "We've achieved a significant milestone in our journey...",
        date: '2024-03-15',
        navigationPath: 'news'
      },
      {
        id: '2',
        type: 'channel',
        title: 'Sales Strategy Update',
        description: 'New approach to enterprise sales...',
        author: 'Sales Team',
        navigationPath: 'channels-sales'
      },
      {
        id: '3',
        type: 'colleague',
        title: 'Product Launch Success',
        description: 'Excited to share our latest product launch results...',
        author: 'John Smith',
        date: '2024-03-14',
        navigationPath: 'colleagues'
      },
    ].filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);

    // Add to recent searches
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const useRecentSearch = (searchQuery) => {
    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  const handleResultClick = (result) => {
    if (result.navigationPath) {
      if (result.navigationPath.startsWith('channels-')) {
        const section = result.navigationPath.replace('channels-', '');
        navigate(`/channels/${section}`);
      } else {
        navigate(`/${result.navigationPath}`);
      }
      setIsOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  return (
    <motion.div 
      className="fixed bottom-4 right-4 z-50"
      ref={searchRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="search-panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="card w-full max-w-lg mx-4 md:mx-0 overflow-hidden shadow-2xl"
        >
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search news, channels, and colleagues..."
                className="flex-1 outline-none text-design-black placeholder-design-primaryGrey bg-transparent"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-design-greyBG rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {query === '' && recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 border-b border-design-greyOutlines"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <History className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="btn-ghost text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      onClick={() => useRecentSearch(search)}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-design-greyBG flex items-center justify-between group transition-colors"
                    >
                      <span className="text-design-black group-hover:text-button-primary-cta transition-colors">{search}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 5 }}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-4 hover:bg-design-greyBG group transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-design-black group-hover:text-button-primary-cta transition-colors">{result.title}</h3>
                        <p className="text-sm text-design-primaryGrey mt-1">{result.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {result.author && (
                            <span className="text-xs text-design-primaryGrey">{result.author}</span>
                          )}
                          {result.date && (
                            <>
                              <span className="text-xs text-design-primaryGrey opacity-50">•</span>
                              <span className="text-xs text-design-primaryGrey">{result.date}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-button-primary-cta bg-button-tertiary-fill px-2 py-1 rounded-full capitalize">
                        {result.type}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : query !== '' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-design-primaryGrey"
              >
                No results found for "{query}"
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-button-primary-cta text-white p-3 rounded-full shadow-lg hover:bg-button-primary-hover transition-all duration-200"
        >
          <Search className="w-6 h-6" />
        </motion.button>
      )}
      </AnimatePresence>
    </motion.div>
  );
}