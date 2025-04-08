import React from 'react';
import { motion } from 'framer-motion';
import NewsFeed from './news/NewsFeed';
import FeedList from './FeedList';
import TopContributors from './news/TopContributors';
import CompanyNews from './news/CompanyNews';

export default function News({ 
  feed, 
  isLoading, 
  error,
  title,
  description 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex gap-0 h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto pr-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          <FeedList feed={feed} isLoading={isLoading} error={error} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block w-80 space-y-6 flex-shrink-0"
        >
          <TopContributors />
          <CompanyNews />
        </motion.div>
      </div>
    </motion.div>
  );
}