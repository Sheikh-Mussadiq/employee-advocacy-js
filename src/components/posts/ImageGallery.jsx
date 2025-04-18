import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  // Preload next image when in lightbox mode
  useEffect(() => {
    if (lightboxOpen && selectedImage !== null && images.length > 1) {
      const nextIndex = (selectedImage + 1) % images.length;
      const nextImage = new Image();
      nextImage.src = images[nextIndex];
    }
  }, [lightboxOpen, selectedImage, images]);

  // Track which images have loaded
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const openLightbox = (index) => {
    setSelectedImage(index);
    setLightboxOpen(true);
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    // Restore body scrolling
    document.body.style.overflow = "auto";
  };

  // Generate appropriate sized srcset for responsive images
  const generateSrcSet = (imageUrl) => {
    if (!imageUrl) return "";

    // If using Unsplash, we can leverage their dynamic resizing
    if (imageUrl.includes("unsplash.com")) {
      const baseUrl = imageUrl.split("?")[0];
      return `
        ${baseUrl}?w=400&fit=crop&auto=format 400w,
        ${baseUrl}?w=800&fit=crop&auto=format 800w,
        ${baseUrl}?w=1200&fit=crop&auto=format 1200w,
        ${baseUrl}?w=1600&fit=crop&auto=format 1600w
      `;
    }

    // For other images, just return the original
    return imageUrl;
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
            {/* Placeholder shown while image is loading */}
            {!loadedImages[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-design-greyBG rounded-lg">
                <div className="animate-pulse flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-design-primaryGrey opacity-50" />
                  <span className="text-xs text-design-primaryGrey mt-2">
                    Loading...
                  </span>
                </div>
              </div>
            )}
            <img
              src={image}
              srcSet={generateSrcSet(image)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt="Post image"
              loading="lazy"
              decoding="async"
              onLoad={() => handleImageLoad(index)}
              className={`rounded-lg object-cover w-full h-full transition-opacity duration-300 ${
                !loadedImages[index] ? "opacity-0" : "opacity-100"
              }`}
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
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
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
              alt="Enlarged post image"
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
            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
