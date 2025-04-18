import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Image, Video, Hash, AtSign, X } from "lucide-react";

export default function CreatePost({
  onSubmit,
  editingPost,
  onUpdate,
  onCancelEdit,
}) {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Set form data when editing a post
  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content || "");
      setIsEditing(true);

      // Convert post images to mediaFiles format
      const newMediaFiles = [];

      if (editingPost.images && editingPost.images.length > 0) {
        editingPost.images.forEach((imageUrl) => {
          newMediaFiles.push({
            url: imageUrl,
            type: "image",
          });
        });
      }

      if (editingPost.video) {
        newMediaFiles.push({
          url: editingPost.video,
          type: "video",
        });
      }

      setMediaFiles(newMediaFiles);

      // Focus the textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    } else {
      setIsEditing(false);
    }
  }, [editingPost]);

  const handleSubmit = () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    if (isEditing && editingPost) {
      // Update existing post
      onUpdate({
        ...editingPost,
        content,
        images: mediaFiles.filter((m) => m.type === "image").map((m) => m.url),
        video: mediaFiles.find((m) => m.type === "video")?.url,
      });
    } else {
      // Create new post
      onSubmit({
        content,
        images: mediaFiles.filter((m) => m.type === "image").map((m) => m.url),
        video: mediaFiles.find((m) => m.type === "video")?.url,
        timestamp: new Date().toISOString(),
      });
    }

    // Reset form
    setContent("");
    setMediaFiles([]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent("");
    setMediaFiles([]);
    setIsEditing(false);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMediaFiles = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      file,
    }));
    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 space-y-4 ${
        isEditing ? "border-2 border-button-primary-cta" : ""
      }`}
    >
      {isEditing && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-design-black">Edit Post</h3>
          <button
            className="text-design-primaryGrey hover:text-design-black"
            onClick={handleCancel}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <textarea
        ref={textareaRef}
        placeholder={
          isEditing
            ? "Edit your post..."
            : "Share something with your colleagues..."
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[100px] resize-none border-none focus:ring-0 text-design-black placeholder:text-design-primaryGrey"
      />

      {mediaFiles.length > 0 && (
        <motion.div layout className="grid grid-cols-2 gap-2">
          {mediaFiles.map((media, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-lg overflow-hidden"
            >
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt=""
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video src={media.url} className="w-full h-48 object-cover" />
              )}
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="flex items-center justify-between border-t border-design-greyOutlines pt-4">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary p-2 rounded-full"
          >
            <Image size={20} className="text-design-primaryGrey" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary p-2 rounded-full"
          >
            <Hash size={20} className="text-design-primaryGrey" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary p-2 rounded-full"
          >
            <AtSign size={20} className="text-design-primaryGrey" />
          </motion.button>
        </div>

        <div className="flex space-x-2">
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="btn-secondary px-4 py-2 text-design-black bg-design-greyBG rounded-lg hover:bg-gray-200"
            >
              Cancel
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="btn-primary px-6 py-2 bg-button-primary-cta text-white rounded-lg hover:bg-button-primary-hover"
          >
            {isEditing ? "Update" : "Post"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
