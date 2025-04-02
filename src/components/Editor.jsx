import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import EmojiPicker from 'emoji-picker-react';
import { Image as ImageIcon, Smile } from 'lucide-react';
import MenuBar from './editor/MenuBar';
import PreviewTabs from './editor/PreviewTabs';
import { useEditor as useEditorContext } from '../context/EditorContext';

export default function Editor() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [previewTab, setPreviewTab] = useState('preview');
  const [isShareThisLoading, setIsShareThisLoading] = useState(false);
  
  const {
    editorContent,
    setEditorContent,
    editorHashtags,
    setEditorHashtags,
    currentImage,
    setCurrentImage,
    imagePosition,
    setImagePosition,
    savedPosts,
    setSavedPosts
  } = useEditorContext();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: editorContent || '<p>Start writing your LinkedIn post here...</p>',
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result;
        setCurrentImage(imageUrl);
        editor?.chain().focus().setImage({ src: imageUrl }).run();
        setImagePosition(editor?.state.selection.from || 0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emojiData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojiPicker(false);
  };

  const saveToLibrary = () => {
    const newPost = {
      id: Date.now().toString(),
      content: editorContent,
      hashtags: editorHashtags,
      image: currentImage,
      date: new Date().toISOString(),
    };
    setSavedPosts([...savedPosts, newPost]);
  };

  const deleteImage = () => {
    setCurrentImage(null);
    const content = editor?.getHTML() || '';
    const newContent = content.replace(/<img[^>]+>/g, '');
    editor?.commands.setContent(newContent);
  };

  useEffect(() => {
    if (window.__sharethis__) {
      setIsShareThisLoading(true);
      window.__sharethis__.load('inline-share-buttons', {
        alignment: 'center',
        font_size: 16,
        has_spacing: true,
        networks: ['linkedin', 'twitter', 'facebook', 'email'],
        padding: 12,
        radius: 4,
        show_total: false,
        size: 40,
        show_mobile_buttons: true,
        min_count: 0,
        url: window.location.href,
        title: 'Check out my LinkedIn post',
        description: editor?.getHTML() || '',
        image: currentImage || '',
        username: '',
        message: editor?.getHTML() || '',
        subject: 'Check out my LinkedIn post',
        onLoad: () => {
          setIsShareThisLoading(false);
        },
        onError: () => {
          setIsShareThisLoading(false);
          console.error('ShareThis failed to load');
        },
        cors_allowed_origins: '*',
        image_preview: false,
        protocol: 'https'
      });
    }
  }, [editorContent, currentImage]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <MenuBar editor={editor} />
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <ImageIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </label>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <Smile className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
          </div>

          {showEmojiPicker && (
            <div className="absolute z-10">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}

          <EditorContent editor={editor} className="prose max-w-none min-h-[200px]" />

          {currentImage && (
            <button
              onClick={deleteImage}
              className="mt-2 text-sm text-red-600 hover:text-red-700"
            >
              Delete Image
            </button>
          )}

          <button
            onClick={saveToLibrary}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save to Library
          </button>
        </div>

        {!isShareThisLoading && (
          <div className="sharethis-inline-share-buttons"></div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <PreviewTabs
          activeTab={previewTab}
          setActiveTab={setPreviewTab}
          content={editorContent}
          hashtags={editorHashtags}
          editor={editor}
          onSnippetSave={(snippet) => setSnippets([...snippets, snippet])}
          snippets={snippets}
        />
      </div>
    </div>
  );
}