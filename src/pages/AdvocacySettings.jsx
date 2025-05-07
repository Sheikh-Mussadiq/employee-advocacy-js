// import React from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';
// import ManageChannelSettings from '../components/settings/ManageChannelSettings';
// import ManageChannelsPanel from '../components/advocacySettings/ManageChannelsPanel';
// import LeaderboardAnnouncementsSettings from '../components/advocacySettings/LeaderboardAnnouncementsSettings';

// export default function AdvocacySettings() {
//   const { socialHubUser } = useAuth();
//   if (socialHubUser?.role !== 'Admin') {
//     return <Navigate to="/settings" replace />;
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8"
//     >
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <h2 className="text-2xl font-bold text-design-black">Advocacy Settings</h2>
//         <p className="text-design-primaryGrey mt-1">Manage advocacy features for your organization</p>
//       </motion.div>
//       <ManageChannelsPanel />
//       {/* <ManageChannelSettings /> */}
//       <LeaderboardAnnouncementsSettings />
//     </motion.div>
//   );
// }

"use client"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import ManageFeedsChannelsPanel from "../components/advocacySettings/ManageFeedsChannelsPanel"
import LeaderboardAnnouncementsSettings from "../components/advocacySettings/LeaderboardAnnouncementsSettings"
import AccessTokenGenerator from "../components/advocacySettings/AccessTokenGenerator"

export default function AdvocacySettings() {
  const { socialHubUser } = useAuth()
  if (socialHubUser?.role !== "ADMIN") {
    return <Navigate to="/settings" replace />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <h2 className="text-2xl font-bold text-design-black">Advocacy Settings</h2>
        <p className="text-design-primaryGrey mt-1">Manage advocacy features for your organization</p>
      </motion.div>
      
      {/* Workspace Access Token - Standalone and prominent */}
      <div className="mb-8">
        <AccessTokenGenerator />
      </div>
      
      {/* Main components */}
      <div className="space-y-6">
        {/* Manage Feeds Channels Panel */}
        <div className="card">
          <ManageFeedsChannelsPanel />
        </div>
        
        {/* Leaderboard announcements component */}
        <div className="card">
          <LeaderboardAnnouncementsSettings />
        </div>
      </div>
    </motion.div>
  )
}
