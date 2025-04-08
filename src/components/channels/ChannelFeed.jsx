// import React, { useState, useRef, useEffect } from 'react';
// import { MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, Send, Image as ImageIcon, X } from 'lucide-react';
// import { format } from 'date-fns';

// const MOCK_HR_POSTS = [
//   {
//     id: '1',
//     author: {
//       name: 'Sarah Miller',
//       role: 'HR Director',
//       avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
//       isModerator: true,
//     },
//     content: `🚀 New Career Opportunity Alert!

// We're looking for a Senior Software Engineer to join our growing team!

// Key Requirements:
// • 5+ years of experience with modern JavaScript frameworks
// • Strong background in cloud technologies
// • Experience with microservices architecture
// • Passion for mentoring junior developers

// What we offer:
// • Competitive salary
// • Remote-first culture
// • Professional development budget
// • Great healthcare benefits

// Share this opportunity with your network! The perfect candidate might be in your connections.

// #TechJobs #SoftwareEngineering #RemoteWork #JobOpportunity`,
//     images: [
//       'https://images.unsplash.com/photo-1522071820081-009f0129c71c'
//     ],
//     timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//     likes: 45,
//     comments: 12,
//     shares: 8,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['Hiring', 'TechJobs', 'Engineering'],
//   },
//   {
//     id: '2',
//     author: {
//       name: 'James Wilson',
//       role: 'Talent Acquisition Lead',
//       avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
//       isModerator: true,
//     },
//     content: `📢 Exciting Growth Opportunities!

// We're expanding our Marketing team and looking for:

// 1. Digital Marketing Manager
// - Lead our digital marketing initiatives
// - 6+ years of experience
// - Strong analytical skills

// 2. Content Strategist
// - Develop content strategy
// - 4+ years of experience
// - Portfolio required

// Why join us?
// • Industry-leading products
// • Innovative work environment
// • Global team collaboration
// • Comprehensive benefits package

// Help us find amazing talent! Share these opportunities with your network.

// Template for sharing:
// "Excited to share that [Company] is growing! We're looking for talented marketers to join our team. Check out these roles: [Link]

// What I love most about working here is [share your experience]"

// #MarketingJobs #JobAlert #CareerGrowth`,
//     timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
//     likes: 38,
//     comments: 15,
//     shares: 10,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['Hiring', 'Marketing', 'Careers'],
//   },
// ];

// const MOCK_SALES_POSTS = [
//   {
//     id: '1',
//     author: {
//       name: 'John Carter',
//       role: 'Sales Manager',
//       avatar: 'https://images.unsplash.com/photo-1593642532979-8c2608d2ab7d',
//       isModerator: false,
//     },
//     content: `🔥 Big Sale Alert! 🔥

// We are offering massive discounts on our entire product range!

// What's on sale?
// • 30% off on all electronics 🖥️
// • 20% off on home appliances 🏠
// • Buy one, get one free on selected accessories 🎁

// Hurry up, offer valid till stocks last! ⏳

// #Sale #Discount #ShopNow #LimitedTimeOffer`,
//     images: [
//       'https://images.unsplash.com/photo-1562184647-6bfc30c92e30'
//     ],
//     timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
//     likes: 120,
//     comments: 25,
//     shares: 15,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['Sale', 'Discount', 'Electronics', 'ShopNow'],
//   },
//   {
//     id: '2',
//     author: {
//       name: 'Emily Green',
//       role: 'Account Executive',
//       avatar: 'https://images.unsplash.com/photo-1568605112-1e100fa4d8da',
//       isModerator: false,
//     },
//     content: `💥 Exclusive Offer for Our VIP Clients 💥

// As a token of appreciation for your continued support, we're offering a personalized 40% off on your next purchase!

// Use code: VIP40 at checkout. 

// #ExclusiveOffer #VIPDiscount #ThankYou #ShopNow`,
//     images: [
//       'https://images.unsplash.com/photo-1556740749-887f6717d7e4'
//     ],
//     timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
//     likes: 80,
//     comments: 10,
//     shares: 5,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['VIP', 'Exclusive', 'Discount', 'ThankYou'],
//   }
// ];

// const MOCK_MARKETING_POSTS = [
//   {
//     id: '1',
//     author: {
//       name: 'Olivia Davis',
//       role: 'Marketing Strategist',
//       avatar: 'https://images.unsplash.com/photo-1534351594725-0c7c59db0132',
//       isModerator: false,
//     },
//     content: `🚀 Boost Your Brand with Influencer Marketing 🚀

// In today's digital age, influencer marketing is the key to expanding your reach. Our team helps you connect with top influencers in your niche to create authentic campaigns that drive results.

// Let’s discuss how we can collaborate and elevate your brand!

// #InfluencerMarketing #BrandAwareness #DigitalMarketing #Growth`,
//     images: [
//       'https://images.unsplash.com/photo-1525094217465-6f3c7e1b6f3b'
//     ],
//     timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
//     likes: 60,
//     comments: 8,
//     shares: 20,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['Marketing', 'Influencer', 'BrandGrowth', 'DigitalMarketing'],
//   },
//   {
//     id: '2',
//     author: {
//       name: 'Liam Carter',
//       role: 'Content Marketing Manager',
//       avatar: 'https://images.unsplash.com/photo-1589985221293-d4ea0bb015f6',
//       isModerator: false,
//     },
//     content: `📈 5 Tips for Effective Content Marketing 📈

// Want to create content that drives traffic and engages your audience? Here are 5 tips that will make your content strategy a success:
// 1. Know your audience.
// 2. Create value-driven content.
// 3. Use storytelling.
// 4. Optimize for SEO.
// 5. Track and measure performance.

// Let’s create content that resonates!

// #ContentMarketing #SEO #Storytelling #Engagement #Growth`,
//     images: [
//       'https://images.unsplash.com/photo-1506378055360-650fa8bbad1c'
//     ],
//     timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
//     likes: 40,
//     comments: 15,
//     shares: 10,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['Marketing', 'ContentStrategy', 'Growth', 'SEO'],
//   }
// ];

// const MOCK_FEEDBACK_POSTS = [
//   {
//     id: '1',
//     author: {
//       name: 'Sophia Adams',
//       role: 'Customer Service Manager',
//       avatar: 'https://images.unsplash.com/photo-1555685813-1c8f71b4ac22',
//       isModerator: false,
//     },
//     content: `📢 We Value Your Feedback! 📢

// We strive to improve and provide the best service possible. Please take a moment to share your recent experience with us:
// • What did you love about our service?
// • What can we improve?

// Your feedback helps us serve you better!

// #CustomerFeedback #Survey #Improvement #ThankYou`,
//     images: [
//       'https://images.unsplash.com/photo-1593642532979-8c2608d2ab7d'
//     ],
//     timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
//     likes: 50,
//     comments: 30,
//     shares: 5,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['Feedback', 'CustomerService', 'Improvement', 'Survey'],
//   },
//   {
//     id: '2',
//     author: {
//       name: 'Benjamin Clark',
//       role: 'Product Manager',
//       avatar: 'https://images.unsplash.com/photo-1569984257-76ef0759b8bc',
//       isModerator: false,
//     },
//     content: `📝 We Want Your Opinion! 📝

// Our latest update is live! We'd love to hear your thoughts on the new features. 
// • What do you think of the new UI?
// • How is the performance after the update?

// Your opinions are vital in shaping the future of our product!

// #UserFeedback #ProductUpdate #CustomerVoice #TechCommunity`,
//     images: [
//       'https://images.unsplash.com/photo-1520749815167-8f5b29edc88a'
//     ],
//     timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
//     likes: 70,
//     comments: 18,
//     shares: 10,
//     hasLiked: false,
//     hasSaved: false,
//     tags: ['Feedback', 'ProductUpdate', 'UserVoice', 'Tech'],
//   }
// ];


// export default function ChannelFeed({ channelName }) {
//   const [posts, setPosts] = useState([]);
//   useEffect(() => {
//     setPosts(() => {
//       switch (channelName) {
//         case 'sales':
//           return MOCK_SALES_POSTS;
//         case 'marketing':
//           return MOCK_MARKETING_POSTS;
//         case 'hr':
//           return MOCK_HR_POSTS;
//         case 'feedback':
//           return MOCK_FEEDBACK_POSTS;
//         default:
//           return [];
//       }
//     })}
// , [channelName]);

//   const [newPost, setNewPost] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const fileInputRef = useRef(null);

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files || []);
    
//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImages(prev => [...prev, reader.result]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (index) => {
//     setSelectedImages(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleLike = (postId) => {
//     setPosts(posts.map(post => {
//       if (post.id === postId) {
//         return {
//           ...post,
//           likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
//           hasLiked: !post.hasLiked,
//         };
//       }
//       return post;
//     }));
//   };

//   const handleSave = (postId) => {
//     setPosts(posts.map(post => {
//       if (post.id === postId) {
//         return {
//           ...post,
//           hasSaved: !post.hasSaved,
//         };
//       }
//       return post;
//     }));
//   };

//   const handleSubmitPost = (e) => {
//     e.preventDefault();
//     if ((!newPost.trim() && selectedImages.length === 0) || isSubmitting) return;

//     setIsSubmitting(true);
    
//     const newPostObj = {
//       id: Date.now().toString(),
//       author: {
//         name: 'Current User',
//         role: 'Team Member',
//         avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
//         isModerator: false,
//       },
//       content: newPost,
//       images: selectedImages,
//       timestamp: new Date().toISOString(),
//       likes: 0,
//       comments: 0,
//       shares: 0,
//       hasLiked: false,
//       hasSaved: false,
//       tags: [],
//     };

//     setPosts([newPostObj, ...posts]);
//     setNewPost('');
//     setSelectedImages([]);
//     setIsSubmitting(false);
//   };

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
//     if (diffInHours < 1) {
//       return 'Just now';
//     } else if (diffInHours < 24) {
//       return `${diffInHours}h ago`;
//     } else {
//       return format(date, 'MMM d');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {channelName === 'feedback' && (
//         <form onSubmit={handleSubmitPost} className="bg-white rounded-lg shadow-sm">
//           <div className="p-4 border-b">
//             <div className="flex items-center space-x-3">
//               <img
//                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
//                 alt="Current user"
//                 className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
//               />
//               <div>
//                 <h3 className="font-semibold text-gray-900">Current User</h3>
//                 <p className="text-sm text-gray-500">Team Member</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-4">
//             <textarea
//               value={newPost}
//               onChange={(e) => setNewPost(e.target.value)}
//               placeholder="Share your content and ask for feedback..."
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-800 placeholder-gray-400 text-base md:text-lg"
//               rows={4}
//             />

//             {selectedImages.length > 0 && (
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {selectedImages.map((image, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={image}
//                       alt={`Upload preview ${index + 1}`}
//                       className="rounded-lg w-full h-48 object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="p-4 border-t bg-gray-50 flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center space-x-2">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageUpload}
//                 accept="image/*"
//                 multiple
//                 className="hidden"
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <ImageIcon className="w-5 h-5" />
//               </button>
//             </div>

//             <button
//               type="submit"
//               disabled={(!newPost.trim() && selectedImages.length === 0) || isSubmitting}
//               className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
//             >
//               <Send className="w-4 h-4" />
//               Post
//             </button>
//           </div>
//         </form>
//       )}

//       {posts.map(post => (
//         <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="p-4 md:p-6">
//             <div className="flex items-start justify-between">
//               <div className="flex items-start space-x-3">
//                 <div className="relative">
//                   <img
//                     src={post.author.avatar}
//                     alt={post.author.name}
//                     className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
//                   />
//                   {post.author.isModerator && (
//                     <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//                       Mod
//                     </span>
//                   )}
//                 </div>
//                 <div>
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
//                     <span className="text-sm text-gray-500">·</span>
//                     <span className="text-sm text-gray-500">{post.author.role}</span>
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">{formatTimestamp(post.timestamp)}</p>
//                 </div>
//               </div>
//               <button className="text-gray-400 hover:text-gray-600">
//                 <MoreHorizontal className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="mt-4">
//               <div className="prose prose-sm max-w-none">
//                 <p className="whitespace-pre-wrap text-base md:text-lg">{post.content}</p>
//               </div>
              
//               {post.images && post.images.length > 0 && (
//                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {post.images.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image}
//                       alt={`Post attachment ${index + 1}`}
//                       className="rounded-lg w-full h-48 object-cover"
//                     />
//                   ))}
//                 </div>
//               )}

//               <div className="mt-4 flex flex-wrap gap-2">
//                 {post.tags.map(tag => (
//                   <span
//                     key={tag}
//                     className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
//                   >
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
//               <div className="flex items-center space-x-4">
//                 <span>{post.likes} likes</span>
//                 <span>{post.comments} comments</span>
//                 <span>{post.shares} shares</span>
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
//               <button
//                 onClick={() => handleLike(post.id)}
//                 className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 ${
//                   post.hasLiked ? 'text-blue-500' : 'text-gray-600'
//                 }`}
//               >
//                 <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-current' : ''}`} />
//                 <span className="text-sm">Like</span>
//               </button>
              
//               <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
//                 <MessageSquare className="w-5 h-5" />
//                 <span className="text-sm">Comment</span>
//               </button>
              
//               <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
//                 <Share2 className="w-5 h-5" />
//                 <span className="text-sm">Share</span>
//               </button>
              
//               <button
//                 onClick={() => handleSave(post.id)}
//                 className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 ${
//                   post.hasSaved ? 'text-blue-500' : 'text-gray-600'
//                 }`}
//               >
//                 <Bookmark className={`w-5 h-5 ${post.hasSaved ? 'fill-current' : ''}`} />
//                 <span className="text-sm">Save</span>
//               </button>
//             </div>
//           </div>
//         </article>
//       ))}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <div className="space-y-6">
        {section === 'feedback' && (
          <form onSubmit={handleSubmitPost} className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="Current user"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Current User</h3>
                  <p className="text-sm text-gray-500">Team Member</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your content and ask for feedback..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-800 placeholder-gray-400 text-base md:text-lg"
                rows={4}
              />

              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload preview ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 flex items-center justify-between flex-wrap gap-4">
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
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={(!newPost.trim() && selectedImages.length === 0) || isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </form>
        )}

        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                    {post.author.isModerator && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        Mod
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-500">{post.author.role}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatTimestamp(post.timestamp)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-base md:text-lg">{post.content}</p>
                </div>
                
                {post.images && post.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post attachment ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 ${
                    post.hasLiked ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">Like</span>
                </button>
                
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Comment</span>
                </button>
                
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>
                
                <button
                  onClick={() => handleSave(post.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 ${
                    post.hasSaved ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.hasSaved ? 'fill-current' : ''}`} />
                  <span className="text-sm">Save</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}