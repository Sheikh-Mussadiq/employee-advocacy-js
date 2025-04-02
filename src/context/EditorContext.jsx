import React, { createContext, useContext, useState, useEffect } from 'react';

const EditorContext = createContext(undefined);

export function EditorProvider({ children }) {
  const [editorContent, setEditorContent] = useState('');
  const [editorHashtags, setEditorHashtags] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePosition, setImagePosition] = useState(0);
  const [savedPosts, setSavedPosts] = useState(() => {
    const saved = localStorage.getItem('savedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  return (
    <EditorContext.Provider value={{
      editorContent,
      setEditorContent,
      editorHashtags,
      setEditorHashtags,
      currentImage,
      setCurrentImage,
      imagePosition,
      setImagePosition,
      savedPosts,
      setSavedPosts,
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}