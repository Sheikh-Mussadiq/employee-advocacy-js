import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rss, ArrowRight } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="p-2 bg-button-tertiary-fill rounded-lg"
            >
              <Rss className="w-5 h-5 text-button-primary-cta" />
            </motion.div>
            <h3 className="text-lg font-medium text-design-black">
              SocialHub Feed URL or RSS
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="feedUrl" className="label">Feed URL</label>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                id="feedUrl"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter feed URL"
                className="input"
                required
              />
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Load Feed
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}