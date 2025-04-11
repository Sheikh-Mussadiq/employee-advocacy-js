import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (index) => {
    setSelectedImage(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div
        className={`grid gap-2 mt-4 ${
          images.length > 1 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-video cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt=""
              className="rounded-lg object-cover w-full h-full"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                );
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={images[selectedImage]}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                );
              }}
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
