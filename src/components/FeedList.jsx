import React from "react";
import { motion } from "framer-motion";
import FeedItem from "./FeedItem";
import PostSkeleton from "./posts/PostSkeleton";

export default function FeedList({ feed, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Feed</h3>
          <p className="text-red-600">
            {typeof error === 'string' ? error : error.message || 'An unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (!feed || !feed.items || feed.items.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Content Available</h3>
          <p className="text-gray-600">There are no feed items to display at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-4">
      {feed.items.map((item, index) => (
        <motion.div
          key={item.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <FeedItem item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
