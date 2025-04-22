import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ManageChannelSettings from '../components/settings/ManageChannelSettings';
import LeaderboardAnnouncementsSettings from '../components/settings/LeaderboardAnnouncementsSettings';

export default function AdvocacySettings() {
  const { currentUser } = useAuth();
  if (currentUser?.role !== 'Admin') {
    return <Navigate to="/settings" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-design-black">Advocacy Settings</h2>
        <p className="text-design-primaryGrey mt-1">Manage advocacy features for your organization</p>
      </motion.div>

      <ManageChannelSettings />
      <LeaderboardAnnouncementsSettings />
    </motion.div>
  );
}
