import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import RSSFeedSettings from '../components/settings/RSSFeedSettings';
import AIPromptSettings from '../components/settings/AIPromptSettings';
import PWASettings from '../components/settings/PWASettings';
import { MOCK_USER } from '../components/settings/UserProfileSettings';

export default function Settings() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('account');
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <img
            src={MOCK_USER.avatar}
            alt={MOCK_USER.name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
          />
          <div>
            <h3 className="text-xl font-semibold text-design-black">{MOCK_USER.name}</h3>
            <p className="text-design-primaryGrey">{MOCK_USER.role}</p>
            <p className="text-design-primaryGrey mt-1">{MOCK_USER.email}</p>
            <p className="text-design-primaryGrey">{MOCK_USER.location}</p>
          </div>
          <button className="ml-auto btn-primary">
            Edit Profile
          </button>
        </div>
      </motion.div>

      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'privacy' && <PrivacySettings />}

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