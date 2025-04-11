import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Image, Video, Hash, AtSign, X } from "lucide-react";

export default function CreatePost({ onSubmit }) {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    onSubmit({
      content,
      images: mediaFiles.filter((m) => m.type === "image").map((m) => m.url),
      video: mediaFiles.find((m) => m.type === "video")?.url,
      timestamp: new Date().toISOString(),
    });

    setContent("");
    setMediaFiles([]);
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
      className="card p-4 space-y-4"
    >
      <textarea
        placeholder="Share something with your colleagues..."
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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="btn-primary px-6 py-2 bg-button-primary-cta text-white rounded-lg hover:bg-button-primary-hover"
        >
          Post
        </motion.button>
      </div>
    </motion.div>
  );
}
