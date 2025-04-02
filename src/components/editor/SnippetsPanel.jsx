import React, { useState } from 'react';
import { Bookmark, Pencil, Trash2 } from 'lucide-react';

export default function SnippetsPanel({
  editor,
  onSnippetSave,
  snippets,
  setSnippets
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  const saveCurrentSelection = () => {
    const selection = editor.state.selection;
    if (!selection.empty) {
      const selectedText = editor.state.doc.textBetween(
        selection.from,
        selection.to
      );
      onSnippetSave(selectedText);
    }
  };

  const insertSnippet = (snippet) => {
    editor.chain().focus().insertContent(snippet).run();
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(snippets[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newSnippets = [...snippets];
      newSnippets[editingIndex] = editingText;
      setSnippets(newSnippets);
      setEditingIndex(null);
    }
  };

  const deleteSnippet = (index) => {
    const newSnippets = snippets.filter((_, i) => i !== index);
    setSnippets(newSnippets);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Save and reuse frequently used text snippets:
        </p>
        <button
          onClick={saveCurrentSelection}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          <Bookmark className="w-4 h-4" />
          Save Selection
        </button>
      </div>

      <div className="space-y-3">
        {snippets.map((snippet, index) => (
          <div key={index} className="border rounded-lg p-3">
            {editingIndex === index ? (
              <div className="space-y-2">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <button
                  onClick={() => insertSnippet(snippet)}
                  className="flex-1 text-left text-sm hover:text-blue-600"
                >
                  <p className="line-clamp-2">{snippet}</p>
                </button>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => startEditing(index)}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSnippet(index)}
                    className="p-1 text-gray-500 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {snippets.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No snippets saved yet. Select text in the editor and click "Save Selection" to create a snippet.
          </p>
        )}
      </div>
    </div>
  );
}