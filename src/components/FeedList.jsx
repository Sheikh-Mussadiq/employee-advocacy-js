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
      <div className="text-center py-8">
        <p className="text-red-500">Error loading feed: {error.message}</p>
      </div>
    );
  }

  if (!feed || !feed.items || feed.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No feed items available</p>
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
