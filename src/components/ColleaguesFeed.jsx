import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_POSTS = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      title: 'Senior Product Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    content: "Excited to share that our new design system is now live! 🎉 This has been a labor of love for our entire team, focusing on accessibility, consistency, and developer experience. Looking forward to seeing how it helps streamline our product development process. #DesignSystems #UX #ProductDesign",
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 128,
    comments: 23,
    shares: 12,
    hasLiked: false,
  },
  {
    id: '2',
    author: {
      name: 'Michael Rodriguez',
      title: 'Lead Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    content: "Just wrapped up an amazing tech talk on microservices architecture! 💻 Big thanks to everyone who attended and participated in the Q&A. Your questions were fantastic! Check out the slides in the comments below. #TechTalk #Microservices #Engineering",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    comments: 15,
    shares: 8,
    hasLiked: false,
  },
  {
    id: '3',
    author: {
      name: 'Emily Watson',
      title: 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    },
    content: "Proud to announce that our latest marketing campaign exceeded all expectations! 📈 A huge shoutout to our incredible team for their creativity and dedication. Here's to pushing boundaries and achieving great results together! #MarketingSuccess #TeamWork",
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    comments: 31,
    shares: 18,
    hasLiked: false,
  },
];

export default function ColleaguesFeed() {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked,
        };
      }
      return post;
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return format(date, 'MMM d');
    }
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
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-6"
    >
      {posts.map(post => (
        <motion.article
          key={post.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="card group hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
                  />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-design-black group-hover:text-button-primary-cta transition-colors">
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-design-primaryGrey">{post.author.title}</p>
                  <p className="text-xs text-design-primaryGrey mt-1">{formatTimestamp(post.timestamp)}</p>
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
              <p className="text-design-black whitespace-pre-wrap leading-relaxed">{post.content}</p>
              {post.image && (
                <motion.img
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  src={post.image}
                  alt="Post attachment"
                  className="mt-6 rounded-xl w-full object-cover max-h-96 shadow-lg"
                />
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
                  post.hasLiked ? 'text-button-primary-cta' : 'text-design-primaryGrey'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </motion.div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}