import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Share2, 
  Trophy, 
  Target, 
  Star,
  CheckCircle2
} from 'lucide-react';

export default function Tutorial() {
  const sections = [
    {
      icon: Rocket,
      title: "Getting Started",
      content: "Once you log in, you'll find all the latest news and updates your company has prepared for you. Think of it as your own treasure trove of shareable content."
    },
    {
      icon: Share2,
      title: "How to Share in 3 Simple Steps",
      content: [
        "Browse Content: Check out the News and Channels sections for fresh content that resonates with your audience.",
        "Use Smart Sharing: Each post comes with AI-powered caption suggestions and hashtag recommendations.",
        "Share and Track: Share directly to your favorite platforms and track your impact in the Analytics section."
      ]
    },
    {
      icon: Trophy,
      title: "Earn Points and Perks",
      content: [
        "Earn points and climb the leaderboard",
        "Unlock awesome perks and rewards",
        "Build your personal brand while supporting company goals"
      ]
    },
    {
      icon: Star,
      title: "Pro Tips to Shine Bright",
      content: [
        "Add your own voice to the caption—your audience follows you for you!",
        "Share consistently to build your presence and keep racking up those points.",
        "Use the feedback channel to get input on your posts before sharing.",
        "Check analytics to understand what content resonates best with your audience."
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900">Help & Tutorial</h2>
        <p className="text-gray-600 mt-1">Learn how to make the most of SocialHub</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-12 shadow-xl"
      >
        <iframe
          src="https://www.youtube.com/embed/y6Sxv-sUYtM"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="card group hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="p-2 bg-button-tertiary-fill rounded-lg"
                >
                  <section.icon className="w-5 h-5 text-button-primary-cta" />
                </motion.div>
                <h3 className="text-lg font-semibold text-design-black group-hover:text-button-primary-cta transition-colors">
                  {section.title}
                </h3>
              </div>
              
              {Array.isArray(section.content) ? (
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-2 text-design-primaryGrey"
                    >
                      <CheckCircle2 className="w-5 h-5 text-semantic-success flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-design-primaryGrey">{section.content}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
        >
          <Target className="w-5 h-5 mr-2" />
          Start Sharing Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
}