import React from 'react';
import LinkedInPreview from './LinkedInPreview';
import HooksPanel from './HooksPanel';
import SnippetsPanel from './SnippetsPanel';
import LibraryPanel from './LibraryPanel';

export default function PreviewTabs({
  activeTab,
  setActiveTab,
  content,
  hashtags,
  editor,
  onSnippetSave,
  snippets,
}) {
  const tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'hooks', label: 'Hooks' },
    { id: 'snippets', label: 'Snippets' },
    { id: 'library', label: 'Library' },
  ];

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4">
        {activeTab === 'preview' && (
          <LinkedInPreview content={content} hashtags={hashtags} />
        )}
        {activeTab === 'hooks' && (
          <HooksPanel editor={editor} />
        )}
        {activeTab === 'snippets' && (
          <SnippetsPanel
            editor={editor}
            onSnippetSave={onSnippetSave}
            snippets={snippets}
          />
        )}
        {activeTab === 'library' && (
          <LibraryPanel editor={editor} />
        )}
      </div>
    </div>
  );
}