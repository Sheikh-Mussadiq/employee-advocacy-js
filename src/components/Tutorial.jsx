import React from 'react';

export default function Tutorial() {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Help & Tutorial</h2>
        <p className="text-gray-600 mt-1">Learn how to make the most of SocialHub</p>
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-8">
        <iframe
          src="https://www.youtube.com/embed/y6Sxv-sUYtM"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="prose prose-blue max-w-none">
        <h1>SocialHub Employee Advocacy Manual: Share, Shine, and Score Big! 🎉</h1>
        
        <h2>🚀 Welcome to SocialHub!</h2>
        <p>
          Once you log in, you'll find all the latest news and updates your company has prepared for you. 
          Think of it as your own treasure trove of shareable content. But why share?
        </p>
        
        <p>Because you're the voice of the brand! Sharing company content helps:</p>
        <ul>
          <li>Promote your company and its awesome projects.</li>
          <li>Boost your personal brand as an expert in your field.</li>
          <li>Show your audience you're in the know about cool, relevant updates.</li>
        </ul>
        <p>It's a win-win for you and the company! 🙌</p>

        <h2>📰 How to Share in 3 Simple Steps:</h2>
        <h3>1. Browse Content</h3>
        <p>Check out the News and Channels sections for fresh content that resonates with your audience.</p>

        <h3>2. Use Smart Sharing</h3>
        <p>
          Each post comes with AI-powered caption suggestions and hashtag recommendations. 
          Customize them to match your voice!
        </p>

        <h3>3. Share and Track</h3>
        <p>Share directly to your favorite platforms and track your impact in the Analytics section.</p>

        <h2>🎯 Earn Points and Perks!</h2>
        <p>Every time you share, you:</p>
        <ul>
          <li>Earn points and climb the leaderboard</li>
          <li>Unlock awesome perks and rewards</li>
          <li>Build your personal brand while supporting company goals</li>
        </ul>

        <h2>🏆 Pro Tips to Shine Bright:</h2>
        <ul>
          <li>Add your own voice to the caption—your audience follows you for you!</li>
          <li>Share consistently to build your presence and keep racking up those points.</li>
          <li>Use the feedback channel to get input on your posts before sharing.</li>
          <li>Check analytics to understand what content resonates best with your audience.</li>
        </ul>

        <p>Ready to be a brand champion? Let's get sharing! 🚀</p>
      </div>
    </div>
  );
}