import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Star, Filter } from "lucide-react";

export default function PostFilters({
  activeFilter,
  onFilterChange,
  onSortChange,
}) {
  const filters = [
    { id: "latest", icon: Clock, label: "Latest" },
    { id: "popular", icon: Star, label: "Popular" },
    { id: "trending", icon: TrendingUp, label: "Trending" },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex space-x-2">
        {filters.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeFilter === id
                ? "bg-button-tertiary-fill text-button-primary-cta"
                : "text-design-primaryGrey hover:bg-design-greyBG"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-design-greyOutlines text-design-primaryGrey"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="mostLikes">Most Likes</option>
        <option value="mostComments">Most Comments</option>
      </select>
    </div>
  );
}
