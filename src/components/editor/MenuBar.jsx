import React from 'react';
import { Bold, Italic, Type, List, ListOrdered, Sparkles } from 'lucide-react';
import AIModal from './AIModal';

export default function MenuBar({ editor }) {
  const [showAIModal, setShowAIModal] = React.useState(false);

  if (!editor) return null;

  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading') ? 'bg-gray-100' : ''}`}
        >
          <Type className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowAIModal(true)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        </button>
      </div>

      <AIModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        editor={editor}
      />
    </>
  );
}