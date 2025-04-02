import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function FloatingCaptionGenerator({ onGenerate, caption, isGenerating }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Generate Caption</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {['linkedin', 'twitter', 'facebook'].map(platform => (
              <button
                key={platform}
                onClick={() => onGenerate(platform)}
                disabled={isGenerating}
                className="w-full p-2 text-left rounded-md hover:bg-gray-50 capitalize"
              >
                {platform} Style
              </button>
            ))}
          </div>

          {caption && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">{caption.caption}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {caption.hashtags.map(tag => (
                  <span key={tag} className="text-xs text-blue-600">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}