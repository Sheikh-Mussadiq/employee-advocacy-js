import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, History, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function FloatingSearch({ setActiveTab }) {
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
      setActiveTab(result.navigationPath);
      setIsOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={searchRef}>
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 md:mx-0 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search news, channels, and colleagues..."
                className="flex-1 outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {query === '' && recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <History className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => useRecentSearch(search)}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <span className="text-gray-700">{search}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{result.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {result.author && (
                            <span className="text-xs text-gray-400">{result.author}</span>
                          )}
                          {result.date && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-400">{result.date}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-400 capitalize">
                        {result.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : query !== '' && (
              <div className="p-8 text-center text-gray-500">
                No results found for "{query}"
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}