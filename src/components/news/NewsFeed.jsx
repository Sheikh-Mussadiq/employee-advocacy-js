import React from "react";
import { motion } from "framer-motion";
import FeedList from "../FeedList";

export default function NewsFeed({ feed, isLoading, error }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 space-y-6 bg-white rounded-lg"
    >
      <FeedList feed={feed} isLoading={isLoading} error={error} />
    </motion.div>
  );
}
