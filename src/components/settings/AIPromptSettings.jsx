import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Sparkles } from 'lucide-react';

export default function AIPromptSettings() {
  const [customPrompt, setCustomPrompt] = useState(
    localStorage.getItem('customPrompt') || ''
  );
  const [isSaved, setIsSaved] = useState(false);

  const saveCustomPrompt = () => {
    localStorage.setItem('customPrompt', customPrompt);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
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
              <Sparkles className="w-5 h-5 text-button-primary-cta" />
            </motion.div>
            <h3 className="text-lg font-medium text-design-black">
              Custom Prompt for Caption Generation
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customPrompt" className="label">Custom Instructions</label>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add additional instructions for AI caption generation..."
                className="input min-h-[120px]"
              />
            </motion.div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveCustomPrompt}
            className={`btn-primary w-full flex items-center justify-center gap-2 ${
              isSaved ? 'bg-semantic-success hover:bg-semantic-success-hover' : ''
            }`}
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Saved Successfully!' : 'Save Custom Prompt'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}