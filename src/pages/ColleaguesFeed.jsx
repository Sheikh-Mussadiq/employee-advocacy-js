import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  Heart,
  MessageSquare,
  Send,
  MoreHorizontal,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Info,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import CompanyNews from "../components/news/CompanyNews";
import CreatePost from "../components/posts/CreatePost";
import PostSkeleton from "../components/posts/PostSkeleton";
import ImageGallery from "../components/posts/ImageGallery";
import { filterFunctions } from "../utils/postSorting";
import PostFilters from "../components/posts/PostFilters";
import CommentModal from "../components/posts/CommentModal";
import { MOCK_POSTS } from "../data/mockPosts";

// Constants for keyboard navigation
const KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  TAB: "Tab",
};

// Swipe threshold for mobile navigation
const SWIPE_CONFIG = {
  delta: 10, // Min distance required for swipe
  preventDefaultTouchmoveEvent: true, // Prevent scrolling while swiping
  trackTouch: true, // Track touch input
  trackMouse: false, // Don't track mouse input
  rotationAngle: 0, // Rotation angle
};

export default function ColleaguesFeed() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState("latest");
  const [sortOrder, setSortOrder] = useState("newest");
  const [focusedPostIndex, setFocusedPostIndex] = useState(-1);
  const [showAccessibilityTip, setShowAccessibilityTip] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const menuRef = useRef(null);

  // Refs for keyboard navigation
  const postRefs = useRef([]);
  const feedRef = useRef(null);

  // Animation controls
  const controls = useAnimation();

  // Track visible posts for optimized rendering
  const [visiblePosts, setVisiblePosts] = useState([]);
  const observer = useRef(null);

  // Initialize intersection observer to track visible posts
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.push(entry.target.dataset.postId);
          }
        });
        setVisiblePosts(visible);
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Observe post elements
  useEffect(() => {
    const currentObserver = observer.current;
    const postElements = postRefs.current;

    if (currentObserver && postElements.length > 0) {
      postElements.forEach((el) => {
        if (el) currentObserver.observe(el);
      });
    }

    return () => {
      if (currentObserver && postElements.length > 0) {
        postElements.forEach((el) => {
          if (el) currentObserver.unobserve(el);
        });
      }
    };
  }, [posts.length]);

  // Generate optimized srcset for avatars
  const optimizeAvatar = (avatar) => {
    if (!avatar) return "";

    // For Unsplash images, use their dynamic resizing
    if (avatar.includes("unsplash.com")) {
      const baseUrl = avatar.split("?")[0];
      return {
        src: `${baseUrl}?w=96&h=96&fit=crop&auto=format`,
        srcSet: `
          ${baseUrl}?w=48&h=48&fit=crop&auto=format 48w,
          ${baseUrl}?w=96&h=96&fit=crop&auto=format 96w,
          ${baseUrl}?w=144&h=144&fit=crop&auto=format 144w
        `,
      };
    }

    return { src: avatar, srcSet: "" };
  };

  // Reset post refs when posts change
  useEffect(() => {
    postRefs.current = postRefs.current.slice(0, posts.length);
  }, [posts.length]);

  // Show accessibility tip on first load
  useEffect(() => {
    const hasSeenTip = localStorage.getItem("hasSeenAccessibilityTip");
    if (!hasSeenTip) {
      setShowAccessibilityTip(true);
      // Don't show again for this session
      localStorage.setItem("hasSeenAccessibilityTip", "true");
    }

    // Add keyboard event listener for global navigation
    const handleKeyDown = (e) => {
      if (document.activeElement === document.body) {
        if (e.key === KEYS.ARROW_DOWN) {
          e.preventDefault();
          setFocusedPostIndex((prev) => Math.min(prev + 1, posts.length - 1));
          if (focusedPostIndex >= 0 && postRefs.current[focusedPostIndex + 1]) {
            postRefs.current[focusedPostIndex + 1].focus();
          }
        } else if (e.key === KEYS.ARROW_UP) {
          e.preventDefault();
          setFocusedPostIndex((prev) => Math.max(prev - 1, 0));
          if (focusedPostIndex > 0 && postRefs.current[focusedPostIndex - 1]) {
            postRefs.current[focusedPostIndex - 1].focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedPostIndex, posts.length]);

  // Configure swipe handlers for mobile navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // Navigate to next post on mobile
      setCurrentPostIndex((prev) => Math.min(prev + 1, posts.length - 1));
      if (postRefs.current[currentPostIndex + 1]) {
        postRefs.current[currentPostIndex + 1].scrollIntoView({
          behavior: "smooth",
        });
      }
    },
    onSwipedRight: () => {
      // Navigate to previous post on mobile
      setCurrentPostIndex((prev) => Math.max(prev - 1, 0));
      if (postRefs.current[currentPostIndex - 1]) {
        postRefs.current[currentPostIndex - 1].scrollIntoView({
          behavior: "smooth",
        });
      }
    },
    ...SWIPE_CONFIG,
  });

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    // Create new posts with unique IDs
    const newPosts = MOCK_POSTS.map((post) => ({
      ...post,
      id: `${post.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000
      ).toISOString(),
    }));

    setTimeout(() => {
      setPosts((prev) => [...prev, ...newPosts]);
      setIsLoading(false);
    }, 1000);
  }, [isLoading, hasMore]);

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.observe(node);
    },
    [isLoading, hasMore, loadMore]
  );

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (newPost) => {
    const post = {
      id: String(Date.now()),
      author: {
        name: "Current User",
        title: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      },
      likes: 0,
      comments: 0,
      shares: 0,
      hasLiked: false,
      // Convert single image to images array for consistency
      images: newPost.images || (newPost.image ? [newPost.image] : []),
      video: newPost.video,
      content: newPost.content,
      timestamp: newPost.timestamp,
    };

    setPosts([post, ...posts]);
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
      return format(date, "MMM d");
    }
  };

  const getFilteredAndSortedPosts = useCallback(() => {
    let filteredPosts = filterFunctions[activeFilter]([...posts]);

    switch (sortOrder) {
      case "oldest":
        return filteredPosts.reverse();
      case "mostLikes":
        return filteredPosts.sort((a, b) => b.likes - a.likes);
      case "mostComments":
        return filteredPosts.sort((a, b) => b.comments - a.comments);
      default:
        return filteredPosts;
    }
  }, [posts, activeFilter, sortOrder]);

  const handleOpenCommentModal = (post) => {
    setSelectedPost(post);
    setCommentModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedPost(null);
    // Restore body scrolling
    document.body.style.overflow = "auto";
  };

  // Handle adding a new comment to a post
  const handleAddComment = (postId, comment) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          // Add the comment to the commentsList array
          const updatedCommentsList = post.commentsList
            ? [...post.commentsList, comment]
            : [comment];

          // Increment the comments count
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: updatedCommentsList,
          };
        }
        return post;
      })
    );
  };

  // Close post menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setPostMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostMenuOpen(null);
  };

  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setConfirmDeleteOpen(true);
    setPostMenuOpen(null);
  };

  const confirmDeletePost = () => {
    if (postToDelete) {
      setPosts(posts.filter((post) => post.id !== postToDelete));
      setConfirmDeleteOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setConfirmDeleteOpen(false);
    setPostToDelete(null);
  };

  const updatePost = (updatedPost) => {
    setPosts(
      posts.map((post) => {
        if (post.id === updatedPost.id) {
          return {
            ...post,
            ...updatedPost,
          };
        }
        return post;
      })
    );
    setEditingPost(null);
  };

  const cancelEditPost = () => {
    setEditingPost(null);
  };

  const togglePostMenu = (postId) => {
    setPostMenuOpen(postMenuOpen === postId ? null : postId);
  };

  // Check if current user is author of the post (demo purposes)
  const isCurrentUserAuthor = (post) => {
    // For demo purposes, consider posts with "Current User" as author to be the current user's posts
    return post.author.name === "Current User";
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-6 max-w-2xl flex flex-col mx-auto"
      ref={feedRef}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Colleagues</h2>
        <p className="text-gray-600 mt-1">
          Support your colleagues' posts with a like or a comment
        </p>
      </div>

      <CreatePost
        onSubmit={handleCreatePost}
        editingPost={editingPost}
        onUpdate={updatePost}
        onCancelEdit={cancelEditPost}
      />
      <PostFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSortChange={setSortOrder}
      />

      {getFilteredAndSortedPosts().map((post, index) => {
        const isVisible = visiblePosts.includes(post.id);
        const optimizedAvatar = optimizeAvatar(post.author.avatar);
        const isFirstPost = index === 0;
        const isOwnPost = isCurrentUserAuthor(post);

        return (
          <motion.article
            key={post.id}
            data-post-id={post.id}
            ref={(el) => {
              // Save the last post ref for infinite loading
              if (index === posts.length - 1) {
                lastPostRef(el);
              }
              // Save all post refs for intersection observer
              postRefs.current[index] = el;
            }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="card group hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <img
                      src={optimizedAvatar.src}
                      srcSet={optimizedAvatar.srcSet}
                      sizes="(max-width: 768px) 40px, 48px"
                      alt={`${post.author.name}'s profile picture`}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
                      loading={isFirstPost || isVisible ? "eager" : "lazy"}
                      width={48}
                      height={48}
                      decoding="async"
                    />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-design-black group-hover:text-button-primary-cta transition-colors">
                      {post.author.name}
                    </h3>
                    <p className="text-sm text-design-primaryGrey">
                      {post.author.title}
                    </p>
                    <p className="text-xs text-design-primaryGrey mt-1">
                      {formatTimestamp(post.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-design-primaryGrey hover:text-button-primary-cta transition-colors"
                    onClick={() => togglePostMenu(post.id)}
                    aria-label="Post options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </motion.button>

                  {postMenuOpen === post.id && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-8 right-0 bg-white shadow-lg rounded-md py-2 z-20 w-48"
                    >
                      {isOwnPost ? (
                        <>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit post
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete post
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <svg
                              className="w-4 h-4 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14M12 5v14" />
                            </svg>
                            Follow {post.author.name}
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <svg
                              className="w-4 h-4 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M16 8v8M8 8v8M3 12h18" />
                            </svg>
                            Hide post
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <svg
                              className="w-4 h-4 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Share post
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <p className="text-design-black whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
                {post.images && post.images.length > 0 && (
                  <div
                    className={
                      isVisible || isFirstPost ? "" : "lazy-load-container"
                    }
                  >
                    <ImageGallery images={post.images} />
                  </div>
                )}
                {post.video && (
                  <video
                    controls
                    className="mt-6 rounded-xl w-full"
                    poster={post.videoPoster}
                    preload={isVisible ? "metadata" : "none"}
                    loading="lazy"
                  >
                    <source src={post.video} type="video/mp4" />
                  </video>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex items-center justify-start text-sm text-design-primaryGrey"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-design-primaryGrey">
                    {post.likes} likes
                  </span>
                  <span className="text-design-primaryGrey">
                    {post.comments} comments
                  </span>
                  <span className="text-design-primaryGrey">
                    {post.shares} shares
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-3 border-t border-design-greyOutlines flex justify-start gap-2"
              >
                <motion.button
                  onClick={() => handleLike(post.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center group text-design-primaryGrey hover:text-button-primary-cta transition-colors rounded-full py-2 px-3 hover:bg-button-tertiary-fill`}
                  aria-label={
                    post.hasLiked ? "Unlike this post" : "Like this post"
                  }
                >
                  <Heart
                    className={`w-5 h-5 mr-2 transition-colors ${
                      post.hasLiked
                        ? "fill-button-primary-cta text-button-primary-cta"
                        : "group-hover:text-button-primary-cta"
                    }`}
                    strokeWidth={post.hasLiked ? 2 : 1.5}
                  />
                  <span
                    className={`text-sm ${
                      post.hasLiked ? "text-button-primary-cta" : ""
                    }`}
                  >
                    {post.hasLiked ? "Liked" : "Like"}
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => handleOpenCommentModal(post)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center group text-design-primaryGrey hover:text-button-primary-cta rounded-full py-2 px-3 hover:bg-button-tertiary-fill transition-colors"
                  aria-label="Comment on this post"
                >
                  <MessageSquare
                    className="w-5 h-5 mr-2 group-hover:text-button-primary-cta transition-colors"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Comment</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center group text-design-primaryGrey hover:text-button-primary-cta rounded-full py-2 px-3 hover:bg-button-tertiary-fill transition-colors"
                  aria-label="Share this post"
                >
                  <Send
                    className="w-5 h-5 mr-2 group-hover:text-button-primary-cta transition-colors"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Share</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.article>
        );
      })}

      {isLoading && (
        <div
          className="space-y-4 sm:space-y-6"
          aria-live="polite"
          aria-busy="true"
        >
          <PostSkeleton index={0} />
          <PostSkeleton index={1} />
          <PostSkeleton index={2} />
        </div>
      )}

      {/* Keyboard navigation instructions for screen readers */}
      <div className="sr-only" aria-live="polite">
        Use arrow keys to navigate between posts. Press Tab to move between
        interactive elements. Press Enter or Space to activate buttons.
      </div>

      {/* Confirm delete dialog */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-2">Delete post?</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. The post will be permanently removed
              from your profile and feed.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDeletePost}
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          isOpen={commentModalOpen}
          onClose={handleCloseCommentModal}
          post={selectedPost}
          onAddComment={(comment) => handleAddComment(selectedPost.id, comment)}
        />
      )}
    </motion.div>
  );
}
