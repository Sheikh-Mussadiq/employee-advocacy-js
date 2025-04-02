import React, { useState } from 'react';
import { fetchRSSFeed } from '../../utils/rss';

export const DEFAULT_FEED_URL = 'https://rss.app/feeds/_LCPPWMOryLvwQgZW.xml';

export default function RSSFeedSettings({
  setFeed,
  setIsLoading,
  setError,
}) {
  const [url, setUrl] = useState(DEFAULT_FEED_URL);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      fetchRSSFeed(url, setFeed, setIsLoading, setError);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        SocialHub Feed URL or RSS
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter feed URL"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Load Feed
          </button>
        </div>
      </form>
    </div>
  );
}