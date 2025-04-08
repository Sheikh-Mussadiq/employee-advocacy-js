import React from 'react';
import { motion } from 'framer-motion';
import RSSFeedSettings from './settings/RSSFeedSettings';
import AIPromptSettings from './settings/AIPromptSettings';
import PWASettings from './settings/PWASettings';

export default function Settings({ setFeed, setIsLoading, setError }) {
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
        <h2 className="text-2xl font-bold text-design-black">Settings</h2>
        <p className="text-design-primaryGrey mt-1">Configure your content preferences</p>
      </motion.div>

      <RSSFeedSettings
        setFeed={setFeed}
        setIsLoading={setIsLoading}
        setError={setError}
      />
      <AIPromptSettings />
      <PWASettings />
    </motion.div>
  );
}