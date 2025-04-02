import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function AIPromptSettings() {
  const [customPrompt, setCustomPrompt] = useState(
    localStorage.getItem('customPrompt') || ''
  );

  const saveCustomPrompt = () => {
    localStorage.setItem('customPrompt', customPrompt);
    alert('Custom prompt saved successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Custom Prompt for Caption Generation
      </h3>
      <div className="space-y-4">
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Add additional instructions for AI caption generation..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
        />
        <button
          onClick={saveCustomPrompt}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="w-4 h-4" />
          Save Custom Prompt
        </button>
      </div>
    </div>
  );
}