import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { format } from 'date-fns';

export default function LibraryPanel({ editor }) {
  const { 
    savedPosts, 
    setSavedPosts, 
    setEditorContent, 
    setEditorHashtags,
    setCurrentImage,
    setImagePosition
  } = useEditor();

  const loadPost = (postId) => {
    const post = savedPosts.find(p => p.id === postId);
    if (post) {
      setEditorContent(post.content);
      setEditorHashtags(post.hashtags);
      setCurrentImage(post.image);
      setImagePosition(post.content.indexOf('<img'));
      editor.commands.setContent(post.content);
    }
  };

  const deletePost = (postId) => {
    setSavedPosts(savedPosts.filter(p => p.id !== postId));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Saved Posts</h3>
      
      {savedPosts.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No saved posts yet. Use the "Save to Library" button to store your posts.
        </p>
      ) : (
        <div className="space-y-3">
          {savedPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(post.date), 'MMM d, yyyy')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadPost(post.id)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-1 text-red-500 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none mb-2">
                <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
              </div>
              
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-blue-600">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}