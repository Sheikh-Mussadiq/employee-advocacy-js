import React from "react";
import { motion } from "framer-motion";

export default function PostSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-design-greyBG animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-design-greyBG rounded animate-pulse" />
          <div className="h-3 w-24 bg-design-greyBG rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-design-greyBG rounded animate-pulse" />
        <div className="h-4 bg-design-greyBG rounded w-3/4 animate-pulse" />
      </div>
      <div className="h-64 bg-design-greyBG rounded-xl animate-pulse" />
    </div>
  );
}
