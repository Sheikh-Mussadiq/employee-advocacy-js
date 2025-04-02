import React from 'react';

export default function LinkedInPreview({ content, hashtags }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-[550px] mx-auto">
      <div className="flex items-center mb-4">
        <img
          src="https://i.pravatar.cc/150?img=1"
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-3">
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-sm text-gray-500">Software Engineer at Company</p>
        </div>
      </div>
      
      <div className="prose prose-sm max-w-none mb-4" 
           dangerouslySetInnerHTML={{ __html: content }} />
      
      <div className="flex flex-wrap gap-2 mt-4">
        {hashtags.map((tag, index) => (
          <span key={index} className="text-blue-600 text-sm">
            #{tag}
          </span>
        ))}
      </div>

      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>0 Reactions</span>
          <span>0 Comments</span>
        </div>
      </div>
    </div>
  );
}