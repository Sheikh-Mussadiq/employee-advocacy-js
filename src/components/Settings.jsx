import React from 'react';
import RSSFeedSettings from './settings/RSSFeedSettings';
import AIPromptSettings from './settings/AIPromptSettings';
import PWASettings from './settings/PWASettings';

export default function Settings({ setFeed, setIsLoading, setError }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Configure your content preferences</p>
      </div>

      <RSSFeedSettings
        setFeed={setFeed}
        setIsLoading={setIsLoading}
        setError={setError}
      />
      <AIPromptSettings />
      <PWASettings />
    </div>
  );
}