import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Info,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import CompanyNews from "../components/news/CompanyNews";
import CreatePost from "../components/posts/CreatePost";
import PostSkeleton from "../components/posts/PostSkeleton";
import ImageGallery from "../components/posts/ImageGallery";
import { filterFunctions } from "../utils/postSorting";
import PostFilters from "../components/posts/PostFilters";
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

  // Refs for keyboard navigation
  const postRefs = useRef([]);
  const feedRef = useRef(null);

  // Animation controls
  const controls = useAnimation();

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
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Colleagues</h2>
        <p className="text-gray-600 mt-1">
          Support your colleagues' posts with a like or a comment
        </p>
      </div>

      <CreatePost onSubmit={handleCreatePost} />
      <PostFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSortChange={setSortOrder}
      />

      {getFilteredAndSortedPosts().map((post, index) => (
        <motion.article
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
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
                    src={post.author.avatar}
                    alt={`${post.author.name}'s profile picture`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
                    loading="lazy"
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
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="text-design-primaryGrey hover:text-button-primary-cta transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </motion.button>
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
              {post.images && <ImageGallery images={post.images} />}
              {post.video && (
                <video
                  controls
                  className="mt-6 rounded-xl w-full"
                  poster={post.videoPoster}
                >
                  <source src={post.video} type="video/mp4" />
                </video>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center justify-between text-sm text-design-primaryGrey"
            >
              <div className="flex items-center space-x-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-button-primary-cta rounded-full p-1"
                >
                  <ThumbsUp className="w-3 h-3 text-white" />
                </motion.div>
                <span>{post.likes}</span>
              </div>
              <div className="flex space-x-4">
                <span>{post.comments} comments</span>
                <span>{post.shares} shares</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-4 border-t border-design-greyOutlines flex justify-between"
            >
              <button
                onClick={() => handleLike(post.id)}
                className={`btn-secondary flex items-center space-x-2 ${
                  post.hasLiked
                    ? "text-button-primary-cta"
                    : "text-design-primaryGrey"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${post.hasLiked ? "fill-current" : ""}`}
                />
                <span>Like</span>
              </button>
              <button
                className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base touch-action-manipulation"
                aria-label="Comment on this post"
              >
                <MessageCircle
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  aria-hidden="true"
                />
                <span>Comment</span>
              </button>
              <button
                className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm touch-action-manipulation"
                aria-label="Share this post"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <span>Share</span>
              </button>
            </motion.div>
          </div>
        </motion.article>
      ))}

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
    </motion.div>
  );
}
