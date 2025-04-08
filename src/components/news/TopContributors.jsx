import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TOP_CONTRIBUTORS = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    points: 2500,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    points: 2100,
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    points: 1800,
  },
];

export default function TopContributors() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-design-black">Top Contributors</h3>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Trophy className="w-5 h-5 text-yellow-500" />
        </motion.div>
      </div>
      
      <div className="space-y-4">
        {TOP_CONTRIBUTORS.map((contributor, index) => (
          <motion.div 
            key={contributor.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-design-greyBG transition-colors duration-200"
          >
            <img
              src={contributor.avatar}
              alt={contributor.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2 transition-all duration-200"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-design-black truncate">{contributor.name}</p>
              <p className="text-sm text-design-primaryGrey truncate">{contributor.role}</p>
            </div>
            <motion.div 
              className="text-sm font-medium text-button-primary-cta"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {contributor.points.toLocaleString()} pts
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/leaderboard')}
        className="btn-secondary w-full mt-4"
      >
        View All
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}