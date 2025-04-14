import React from "react";
import { motion } from "framer-motion";
import FeedItem from "./FeedItem";

export default function FeedList({ feed, isLoading, error }) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[200px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-button-primary-cta/30 border-t-button-primary-cta rounded-full"
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-6 bg-semantic-error-light rounded-xl border border-semantic-error/20"
      >
        <p className="text-semantic-error font-medium">{error}</p>
      </motion.div>
    );
  }

  if (!feed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-6 bg-design-greyBG rounded-xl border border-design-greyOutlines"
      >
        <p className="text-design-primaryGrey font-medium">
          Enter an RSS feed URL to get started
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-6 max-w-2xl flex flex-col mx-auto"
    >
      {feed.items.map((item, index) => (
        <FeedItem key={item.link + index} item={item} />
      ))}
    </motion.div>
  );
}
