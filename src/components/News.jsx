import React from "react";
import { motion } from "framer-motion";
import NewsFeed from "./news/NewsFeed";
import FeedList from "./FeedList";

export default function News({ feed, isLoading, error, title, description }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <FeedList feed={feed} isLoading={isLoading} error={error} />
    </motion.div>
  );
}
