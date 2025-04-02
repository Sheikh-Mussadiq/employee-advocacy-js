import React from 'react';

export default function PWASettings() {
  const handleInstallClick = () => {
    if ('standalone' in window.navigator && !window.navigator.standalone) {
      alert('To install on iOS: tap the share icon and select "Add to Home Screen"');
    } else if ('serviceWorker' in navigator) {
      alert('To install on Android: tap the menu icon and select "Add to Home Screen"');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Add to Home Screen
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Install SocialHub as a progressive web app on your device:
      </p>
      <button
        onClick={handleInstallClick}
        className="inline-block px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Add to Home Screen
      </button>
    </div>
  );
}