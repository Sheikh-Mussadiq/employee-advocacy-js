import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Heart,
  MoreHorizontal,
  CornerDownRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CommentModal = ({ isOpen, onClose, post, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const replyInputRef = useRef(null);

  // Initialize comments from post data when post changes
  useEffect(() => {
    if (post && post.commentsList) {
      setComments(post.commentsList);
    }
    // Reset image index when post changes
    setCurrentImageIndex(0);
  }, [post]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Focus reply input when replying
  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingTo]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (replyingTo) {
          setReplyingTo(null);
          setReplyText("");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, replyingTo]);

  // Handle keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || !post.images || post.images.length <= 1) return;

      if (e.key === "ArrowLeft") {
        navigateToPrevImage();
      } else if (e.key === "ArrowRight") {
        navigateToNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, post, currentImageIndex]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      },
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      hasLiked: false,
      replies: [],
    };

    // Update local state
    setComments([...comments, comment]);

    // Notify parent component
    if (onAddComment) {
      onAddComment(comment);
    }

    setNewComment("");
  };

  const navigateToNextImage = () => {
    if (!post.images || post.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const navigateToPrevImage = () => {
    if (!post.images || post.images.length <= 1) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + post.images.length) % post.images.length
    );
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSubmitReply = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim() || !commentId) return;

    const reply = {
      id: `reply-${Date.now()}`,
      author: {
        name: "Current User",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      },
      text: replyText,
      timestamp: new Date().toISOString(),
      likes: 0,
      hasLiked: false,
    };

    // Update comment with new reply
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies ? [...comment.replies, reply] : [reply],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyingTo(null);
    setReplyText("");
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return days === 1 ? "1d ago" : `${days}d ago`;
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
            hasLiked: !comment.hasLiked,
          };
        }
        return comment;
      })
    );
  };

  const handleLikeReply = (commentId, replyId) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId && comment.replies) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: reply.hasLiked ? reply.likes - 1 : reply.likes + 1,
                hasLiked: !reply.hasLiked,
              };
            }
            return reply;
          });

          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        return comment;
      })
    );
  };

  if (!isOpen) return null;

  // Determine if we have multiple images
  const hasMultipleImages = post.images && post.images.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-[80vh] max-h-[700px] shadow-2xl"
        >
          {/* Left side - Media content */}
          <div className="md:w-1/2 bg-black flex items-center justify-center relative h-[300px] md:h-full">
            {post.images && post.images.length > 0 ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                {/* Image navigation for multiple images */}
                {hasMultipleImages && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white rounded-full p-1 hover:bg-black/50 transition-colors"
                      onClick={navigateToPrevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white rounded-full p-1 hover:bg-black/50 transition-colors"
                      onClick={navigateToNextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Current image */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={post.images[currentImageIndex]}
                    alt={`Post image ${currentImageIndex + 1} of ${
                      post.images.length
                    }`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Image counter */}
                {hasMultipleImages && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {post.images.length}
                  </div>
                )}
              </div>
            ) : post.video ? (
              <video
                controls
                className="w-full h-full object-cover"
                poster={post.videoPoster}
              >
                <source src={post.video} type="video/mp4" />
              </video>
            ) : (
              <div className="text-white text-lg p-6 text-center">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            )}
          </div>

          {/* Right side - Comments */}
          <div className="md:w-1/2 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={`${post.author.name}'s profile`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">{post.author.name}</h3>
                  <p className="text-xs text-gray-500">{post.author.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close comments"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments section */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {/* Original post content */}
              <div className="flex space-x-3">
                <img
                  src={post.author.avatar}
                  alt={`${post.author.name}'s profile`}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="flex items-baseline space-x-2">
                    <h4 className="font-semibold text-sm">
                      {post.author.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(post.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{post.content}</p>
                </div>
              </div>

              {/* Comment list */}
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    {/* Main comment */}
                    <div className="flex space-x-3">
                      <img
                        src={comment.author.avatar}
                        alt={`${comment.author.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex items-baseline space-x-2">
                          <h4 className="font-semibold text-sm">
                            {comment.author.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.text}</p>
                        <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                          <button
                            className="hover:text-gray-800"
                            onClick={() => handleReply(comment.id)}
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={
                              comment.hasLiked ? "text-button-primary-cta" : ""
                            }
                          >
                            {comment.likes > 0 && `${comment.likes} `}
                            {comment.likes === 1
                              ? "like"
                              : comment.likes > 1
                              ? "likes"
                              : "Like"}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex-shrink-0 ${
                          comment.hasLiked
                            ? "text-button-primary-cta"
                            : "text-gray-400"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            comment.hasLiked ? "fill-button-primary-cta" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-11 mt-2"
                      >
                        <form
                          onSubmit={(e) => handleSubmitReply(e, comment.id)}
                          className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2"
                        >
                          <input
                            ref={replyInputRef}
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.author.name}...`}
                            className="flex-grow py-1 px-2 bg-transparent text-sm focus:outline-none"
                          />
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={handleCancelReply}
                              className="text-gray-500 text-xs hover:text-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={!replyText.trim()}
                              className={`text-button-primary-cta text-xs ${
                                !replyText.trim()
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Reply
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 pl-5 border-l border-gray-100 space-y-3 mt-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <img
                              src={reply.author.avatar}
                              alt={`${reply.author.name}'s profile`}
                              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-grow">
                              <div className="flex items-baseline space-x-2">
                                <h4 className="font-semibold text-xs">
                                  {reply.author.name}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{reply.text}</p>
                              <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                                <button
                                  onClick={() =>
                                    handleLikeReply(comment.id, reply.id)
                                  }
                                  className={
                                    reply.hasLiked
                                      ? "text-button-primary-cta"
                                      : ""
                                  }
                                >
                                  {reply.likes > 0 && `${reply.likes} `}
                                  {reply.likes === 1
                                    ? "like"
                                    : reply.likes > 1
                                    ? "likes"
                                    : "Like"}
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleLikeReply(comment.id, reply.id)
                              }
                              className={`flex-shrink-0 ${
                                reply.hasLiked
                                  ? "text-button-primary-cta"
                                  : "text-gray-400"
                              }`}
                            >
                              <Heart
                                className={`w-3 h-3 ${
                                  reply.hasLiked
                                    ? "fill-button-primary-cta"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Comment input */}
            <form
              onSubmit={handleSubmitComment}
              className="border-t border-gray-200 p-3 flex items-center space-x-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow py-2 px-3 bg-transparent text-sm focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`text-button-primary-cta ${
                  !newComment.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentModal;
