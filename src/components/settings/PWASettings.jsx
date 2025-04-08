import React from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone } from 'lucide-react';

export default function PWASettings() {
  const handleInstallClick = () => {
    if ('standalone' in window.navigator && !window.navigator.standalone) {
      alert('To install on iOS: tap the share icon and select "Add to Home Screen"');
    } else if ('serviceWorker' in navigator) {
      alert('To install on Android: tap the menu icon and select "Add to Home Screen"');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="p-2 bg-button-tertiary-fill rounded-lg"
            >
              <Smartphone className="w-5 h-5 text-button-primary-cta" />
            </motion.div>
            <h3 className="text-lg font-medium text-design-black">
              Add to Home Screen
            </h3>
          </div>
        </div>

        <p className="text-design-primaryGrey">
          Install SocialHub as a progressive web app on your device for quick access and a native app-like experience.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleInstallClick}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Add to Home Screen
        </motion.button>
      </div>
    </motion.div>
  );
}