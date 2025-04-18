import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NewsFeed from "../components/news/NewsFeed";
import { fetchRSSFeed } from "../utils/rss";
import { DEFAULT_FEED_URL } from "../components/settings/RSSFeedSettings";

export default function News() {
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRSSFeed(DEFAULT_FEED_URL, setFeed, setIsLoading, setError);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-4"
    >
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Company News
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Latest updates and announcements from the company
        </p>
      </div>
      <div className="">
        <NewsFeed feed={feed} isLoading={isLoading} error={error} />
      </div>
    </motion.div>
  );
}
