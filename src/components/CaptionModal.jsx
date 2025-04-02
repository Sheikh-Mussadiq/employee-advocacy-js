import React from 'react';
import { X } from 'lucide-react';

export default function CaptionModal({ isOpen, onClose, onGenerate, caption, isGenerating }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold mb-4">Generate AI Caption</h3>
        
        <div className="space-y-4">
          <button
            onClick={() => onGenerate('linkedin')}
            disabled={isGenerating}
            className="w-full p-3 text-left rounded-lg border hover:bg-gray-50"
          >
            LinkedIn Style
          </button>
          <button
            onClick={() => onGenerate('twitter')}
            disabled={isGenerating}
            className="w-full p-3 text-left rounded-lg border hover:bg-gray-50"
          >
            Twitter Style
          </button>
          <button
            onClick={() => onGenerate('facebook')}
            disabled={isGenerating}
            className="w-full p-3 text-left rounded-lg border hover:bg-gray-50"
          >
            Facebook Style
          </button>
        </div>

        {isGenerating && (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Generating caption...</p>
          </div>
        )}

        {caption && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{caption.caption}</p>
            <div className="mt-2 flex gap-1">
              {caption.hashtags.map(tag => (
                <span key={tag} className="text-xs text-blue-600">#{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}