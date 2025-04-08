import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, Send, Image as ImageIcon, X } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_HR_POSTS = [
  {
    id: '1',
    author: {
      name: 'Sarah Miller',
      role: 'HR Director',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      isModerator: true,
    },
    content: `🚀 New Career Opportunity Alert!

We're looking for a Senior Software Engineer to join our growing team!

Key Requirements:
• 5+ years of experience with modern JavaScript frameworks
• Strong background in cloud technologies
• Experience with microservices architecture
• Passion for mentoring junior developers

What we offer:
• Competitive salary
• Remote-first culture
• Professional development budget
• Great healthcare benefits

Share this opportunity with your network! The perfect candidate might be in your connections.

#TechJobs #SoftwareEngineering #RemoteWork #JobOpportunity`,
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c'
    ],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 45,
    comments: 12,
    shares: 8,
    hasLiked: false,
    hasSaved: false,
    tags: ['Hiring', 'TechJobs', 'Engineering'],
  },
  {
    id: '2',
    author: {
      name: 'James Wilson',
      role: 'Talent Acquisition Lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      isModerator: true,
    },
    content: `📢 Exciting Growth Opportunities!

We're expanding our Marketing team and looking for:

1. Digital Marketing Manager
- Lead our digital marketing initiatives
- 6+ years of experience
- Strong analytical skills

2. Content Strategist
- Develop content strategy
- 4+ years of experience
- Portfolio required

Why join us?
• Industry-leading products
• Innovative work environment
• Global team collaboration
• Comprehensive benefits package

Help us find amazing talent! Share these opportunities with your network.

Template for sharing:
"Excited to share that [Company] is growing! We're looking for talented marketers to join our team. Check out these roles: [Link]

What I love most about working here is [share your experience]"

#MarketingJobs #JobAlert #CareerGrowth`,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 38,
    comments: 15,
    shares: 10,
    hasLiked: false,
    hasSaved: false,
    tags: ['Hiring', 'Marketing', 'Careers'],
  },
];

const MOCK_SALES_POSTS = [
  {
    id: '1',
    author: {
      name: 'John Carter',
      role: 'Sales Manager',
      avatar: 'https://images.unsplash.com/photo-1593642532979-8c2608d2ab7d',
      isModerator: false,
    },
    content: `🔥 Big Sale Alert! 🔥

We are offering massive discounts on our entire product range!

What's on sale?
• 30% off on all electronics 🖥️
• 20% off on home appliances 🏠
• Buy one, get one free on selected accessories 🎁

Hurry up, offer valid till stocks last! ⏳

#Sale #Discount #ShopNow #LimitedTimeOffer`,
    images: [
      'https://images.unsplash.com/photo-1562184647-6bfc30c92e30'
    ],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 120,
    comments: 25,
    shares: 15,
    hasLiked: false,
    hasSaved: false,
    tags: ['Sale', 'Discount', 'Electronics', 'ShopNow'],
  },
  {
    id: '2',
    author: {
      name: 'Emily Green',
      role: 'Account Executive',
      avatar: 'https://images.unsplash.com/photo-1568605112-1e100fa4d8da',
      isModerator: false,
    },
    content: `💥 Exclusive Offer for Our VIP Clients 💥

As a token of appreciation for your continued support, we're offering a personalized 40% off on your next purchase!

Use code: VIP40 at checkout. 

#ExclusiveOffer #VIPDiscount #ThankYou #ShopNow`,
    images: [
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4'
    ],
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    likes: 80,
    comments: 10,
    shares: 5,
    hasLiked: false,
    hasSaved: false,
    tags: ['VIP', 'Exclusive', 'Discount', 'ThankYou'],
  }
];

const MOCK_MARKETING_POSTS = [
  {
    id: '1',
    author: {
      name: 'Olivia Davis',
      role: 'Marketing Strategist',
      avatar: 'https://images.unsplash.com/photo-1534351594725-0c7c59db0132',
      isModerator: false,
    },
    content: `🚀 Boost Your Brand with Influencer Marketing 🚀

In today's digital age, influencer marketing is the key to expanding your reach. Our team helps you connect with top influencers in your niche to create authentic campaigns that drive results.

Let's discuss how we can collaborate and elevate your brand!

#InfluencerMarketing #BrandAwareness #DigitalMarketing #Growth`,
    images: [
      'https://images.unsplash.com/photo-1525094217465-6f3c7e1b6f3b'
    ],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 60,
    comments: 8,
    shares: 20,
    hasLiked: false,
    hasSaved: false,
    tags: ['Marketing', 'Influencer', 'BrandGrowth', 'DigitalMarketing'],
  },
  {
    id: '2',
    author: {
      name: 'Liam Carter',
      role: 'Content Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1589985221293-d4ea0bb015f6',
      isModerator: false,
    },
    content: `📈 5 Tips for Effective Content Marketing 📈

Want to create content that drives traffic and engages your audience? Here are 5 tips that will make your content strategy a success:
1. Know your audience.
2. Create value-driven content.
3. Use storytelling.
4. Optimize for SEO.
5. Track and measure performance.

Let's create content that resonates!

#ContentMarketing #SEO #Storytelling #Engagement #Growth`,
    images: [
      'https://images.unsplash.com/photo-1506378055360-650fa8bbad1c'
    ],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 40,
    comments: 15,
    shares: 10,
    hasLiked: false,
    hasSaved: false,
    tags: ['Marketing', 'ContentStrategy', 'Growth', 'SEO'],
  }
];

const MOCK_FEEDBACK_POSTS = [
  {
    id: '1',
    author: {
      name: 'Sophia Adams',
      role: 'Customer Service Manager',
      avatar: 'https://images.unsplash.com/photo-1555685813-1c8f71b4ac22',
      isModerator: false,
    },
    content: `📢 We Value Your Feedback! 📢

We strive to improve and provide the best service possible. Please take a moment to share your recent experience with us:
• What did you love about our service?
• What can we improve?

Your feedback helps us serve you better!

#CustomerFeedback #Survey #Improvement #ThankYou`,
    images: [
      'https://images.unsplash.com/photo-1593642532979-8c2608d2ab7d'
    ],
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 50,
    comments: 30,
    shares: 5,
    hasLiked: false,
    hasSaved: false,
    tags: ['Feedback', 'CustomerService', 'Improvement', 'Survey'],
  },
  {
    id: '2',
    author: {
      name: 'Benjamin Clark',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1569984257-76ef0759b8bc',
      isModerator: false,
    },
    content: `📝 We Want Your Opinion! 📝

Our latest update is live! We'd love to hear your thoughts on the new features. 
• What do you think of the new UI?
• How is the performance after the update?

Your opinions are vital in shaping the future of our product!

#UserFeedback #ProductUpdate #CustomerVoice #TechCommunity`,
    images: [
      'https://images.unsplash.com/photo-1520749815167-8f5b29edc88a'
    ],
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    likes: 70,
    comments: 18,
    shares: 10,
    hasLiked: false,
    hasSaved: false,
    tags: ['Feedback', 'ProductUpdate', 'UserVoice', 'Tech'],
  }
];


export default function ChannelFeed() {
  const { section } = useParams();
  const [posts, setPosts] = useState([]);
  
  let title = '';
  let description = '';

  switch (section) {
    case 'sales':
      title = 'Sales Channel';
      description = 'Content inspiration and best practices for sales professionals';
      break;
    case 'marketing':
      title = 'Marketing Channel';
      description = 'Content inspiration and best practices for marketing professionals';
      break;
    case 'hr':
      title = 'HR Channel';
      description = 'Share open positions and career opportunities with your network';
      break;
    case 'feedback':
      title = 'Ask for Feedback';
      description = 'Share your content and get feedback from your colleagues';
      break;
  }

  useEffect(() => {
    setPosts(() => {
      switch (section) {
        case 'sales':
          return MOCK_SALES_POSTS;
        case 'marketing':
          return MOCK_MARKETING_POSTS;
        case 'hr':
          return MOCK_HR_POSTS;
        case 'feedback':
          return MOCK_FEEDBACK_POSTS;
        default:
          return [];
      }
    });
  }, [section]);

  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

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

  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasSaved: !post.hasSaved,
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if ((!newPost.trim() && selectedImages.length === 0) || isSubmitting) return;

    setIsSubmitting(true);
    
    const newPostObj = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        role: 'Team Member',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        isModerator: false,
      },
      content: newPost,
      images: selectedImages,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      hasLiked: false,
      hasSaved: false,
      tags: [],
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setSelectedImages([]);
    setIsSubmitting(false);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-design-black">{title}</h2>
        <p className="text-design-primaryGrey mt-1">{description}</p>
      </motion.div>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {section === 'feedback' && (
          <motion.form
            onSubmit={handleSubmitPost}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="Current user"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
                />
                <div>
                  <h3 className="font-semibold text-design-black">Current User</h3>
                  <p className="text-sm text-design-primaryGrey">Team Member</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your content and ask for feedback..."
                className="input resize-none text-base md:text-lg"
                rows={4}
              />

              {selectedImages.length > 0 && (
                <motion.div 
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  {selectedImages.map((image, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt={`Upload preview ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-semantic-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="p-4 border-t border-design-greyOutlines bg-design-greyBG flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-design-primaryGrey hover:bg-design-white rounded-full transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={(!newPost.trim() && selectedImages.length === 0) || isSubmitting}
                className="btn-primary rounded-full ml-auto"
              >
                <Send className="w-4 h-4" />
                Post
              </motion.button>
            </div>
          </motion.form>
        )}

        {posts.map(post => (
          <motion.article
            key={post.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="card group hover:shadow-lg transition-all duration-300"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-design-greyOutlines ring-offset-2"
                    />
                    {post.author.isModerator && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-button-primary-cta text-white text-xs px-1.5 py-0.5 rounded-full"
                      >
                        Mod
                      </motion.span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-design-black group-hover:text-button-primary-cta transition-colors">
                        {post.author.name}
                      </h3>
                      <span className="text-sm text-design-primaryGrey">·</span>
                      <span className="text-sm text-design-primaryGrey">{post.author.role}</span>
                    </div>
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

              <div className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-base md:text-lg text-design-black">{post.content}</p>
                </div>
                
                {post.images && post.images.length > 0 && (
                  <motion.div
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                  >
                    {post.images.map((image, index) => (
                      <motion.img
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={{ scale: 1.02 }}
                        key={index}
                        src={image}
                        alt={`Post attachment ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover transition-transform duration-200"
                      />
                    ))}
                  </motion.div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      key={tag}
                      className="px-2 py-1 bg-button-tertiary-fill text-button-primary-cta text-sm rounded-full"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-design-primaryGrey">
                <div className="flex items-center space-x-4">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-design-greyOutlines flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLike(post.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 ${
                    post.hasLiked ? 'text-button-primary-cta' : 'text-design-primaryGrey'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">Like</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-design-greyBG text-design-primaryGrey"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Comment</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-design-greyBG text-design-primaryGrey"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave(post.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 ${
                    post.hasSaved ? 'text-button-primary-cta' : 'text-design-primaryGrey'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.hasSaved ? 'fill-current' : ''}`} />
                  <span className="text-sm">Save</span>
                </motion.button>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.div>
  );
}