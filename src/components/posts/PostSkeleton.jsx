import React from "react";
import { motion } from "framer-motion";

export default function PostSkeleton({ index = 0 }) {
  // Staggered animation delay based on index
  const staggerDelay = index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: staggerDelay, duration: 0.3 }}
      className="card p-6 space-y-4 overflow-hidden"
    >
      {/* Author section with more realistic avatar and text placeholders */}
      <div className="flex items-start space-x-3">
        <div
          className="w-12 h-12 rounded-full bg-design-greyBG animate-pulse"
          style={{ animationDelay: `${staggerDelay}s` }}
          aria-hidden="true"
        />
        <div className="flex-1 space-y-2">
          <div
            className="h-4 w-32 bg-design-greyBG rounded animate-pulse"
            style={{ animationDelay: `${staggerDelay + 0.1}s` }}
            aria-hidden="true"
          />
          <div
            className="h-3 w-24 bg-design-greyBG rounded animate-pulse"
            style={{ animationDelay: `${staggerDelay + 0.2}s` }}
            aria-hidden="true"
          />
          <div
            className="h-2 w-16 bg-design-greyBG rounded animate-pulse"
            style={{ animationDelay: `${staggerDelay + 0.3}s` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Post content with more realistic text placeholders */}
      <div className="space-y-2" aria-label="Loading post content">
        <div
          className="h-4 bg-design-greyBG rounded animate-pulse"
          style={{ animationDelay: `${staggerDelay + 0.4}s` }}
          aria-hidden="true"
        />
        <div
          className="h-4 bg-design-greyBG rounded w-11/12 animate-pulse"
          style={{ animationDelay: `${staggerDelay + 0.5}s` }}
          aria-hidden="true"
        />
        <div
          className="h-4 bg-design-greyBG rounded w-3/4 animate-pulse"
          style={{ animationDelay: `${staggerDelay + 0.6}s` }}
          aria-hidden="true"
        />
      </div>

      {/* Image placeholder with shimmer effect */}
      <div
        className="relative h-48 sm:h-64 bg-design-greyBG rounded-xl overflow-hidden"
        aria-label="Loading post image"
      >
        <div
          className="absolute inset-0 animate-pulse"
          style={{ animationDelay: `${staggerDelay + 0.7}s` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
          style={{ animationDelay: `${staggerDelay + 0.8}s` }}
          aria-hidden="true"
        />
      </div>

      {/* Engagement stats placeholders */}
      <div
        className="mt-4 flex justify-between items-center"
        aria-label="Loading engagement stats"
      >
        <div className="flex space-x-2 items-center">
          <div
            className="h-6 w-6 rounded-full bg-design-greyBG animate-pulse"
            style={{ animationDelay: `${staggerDelay + 0.9}s` }}
            aria-hidden="true"
          />
          <div
            className="h-3 w-8 bg-design-greyBG rounded animate-pulse"
            style={{ animationDelay: `${staggerDelay + 1.0}s` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex space-x-4">
          <div
            className="h-3 w-20 bg-design-greyBG rounded animate-pulse"
            style={{ animationDelay: `${staggerDelay + 1.1}s` }}
            aria-hidden="true"
          />
          <div
            className="h-3 w-16 bg-design-greyBG rounded animate-pulse"
            style={{ animationDelay: `${staggerDelay + 1.2}s` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Action buttons placeholders */}
      <div
        className="mt-4 pt-4 border-t border-design-greyOutlines flex justify-between"
        aria-label="Loading action buttons"
      >
        <div
          className="h-8 w-20 bg-design-greyBG rounded-md animate-pulse"
          style={{ animationDelay: `${staggerDelay + 1.3}s` }}
          aria-hidden="true"
        />
        <div
          className="h-8 w-24 bg-design-greyBG rounded-md animate-pulse"
          style={{ animationDelay: `${staggerDelay + 1.4}s` }}
          aria-hidden="true"
        />
        <div
          className="h-8 w-20 bg-design-greyBG rounded-md animate-pulse"
          style={{ animationDelay: `${staggerDelay + 1.5}s` }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}
